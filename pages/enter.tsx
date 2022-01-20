const EnterPage = () => {
    const user = null;
    const username = null;

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
    return <button>Sign In</button>;
}

function SingOutButton() {
    return <button>Sign Out</button>;
}

function UsernameForm() {
    return (
        <form>
            <label>Username:</label>
            <input />
        </form>
    );
}

export default EnterPage;
