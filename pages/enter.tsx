import toast from 'react-hot-toast';
import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { FcGoogle } from 'react-icons/fc';
import {
    ChangeEvent,
    FormEvent,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';
import { UserContext } from '../lib/context';
import debounce from 'lodash.debounce';

const EnterPage = () => {
    const { user, username } = useContext(UserContext);

    return (
        <main>
            {user ? (
                !username ? (
                    <UsernameForm />
                ) : (
                    <SingOutButton />
                )
            ) : (
                <SingInButton />
            )}
        </main>
    );
};

function SingInButton() {
    const signInWithGoogle = async () => {
        try {
            await auth.signInWithPopup(googleAuthProvider);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };
    return (
        <button className='btn-google' onClick={signInWithGoogle}>
            <FcGoogle size={20} /> Sing in with google
        </button>
    );
}

function SingOutButton() {
    return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        // commit both documents to firestore as a batch write

        try {
            const batch = firestore.batch();
            batch.set(userDoc, {
                username: formValue,
                photoURL: user.photoURL,
                displayName: user.displayName,
            });
            batch.set(usernameDoc, { uid: user.uid });

            await batch.commit();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const val = target.value.toLowerCase();

        const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val.length < 3) {
            setFormValue(val);
            setIsLoading(false);
            setIsValid(false);
        }

        if (re.test(val)) {
            setFormValue(val);
            setIsLoading(true);
            setIsValid(false);
        }
    };

    const checkUsername = useCallback(
        debounce(async (username: string) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`);
                const { exists } = await ref.get();
                console.log('Firestore read excecuted');
                setIsValid(!exists);
                setIsLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue, checkUsername]);

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit} autoComplete='off'>
                    <input
                        type='text'
                        name='username'
                        placeholder='username'
                        value={formValue}
                        onChange={onChange}
                    />
                    <UsernameMessage
                        isLoading={isLoading}
                        isValid={isValid}
                        username={formValue}
                    />

                    <button
                        type='submit'
                        className='btn-green'
                        disabled={!isValid}
                    >
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {String(isLoading)}
                        <br />
                        Username Valid: {String(isValid)}
                    </div>
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, isLoading }) {
    if (isLoading) {
        return <p>Checking ...</p>;
    } else if (isValid) {
        return <p className='text-success'>{username} is available</p>;
    } else if (username && !isValid) {
        return <p className='text-danger'>{username} is aleready taken</p>;
    } else {
        return null;
    }
}

export default EnterPage;
