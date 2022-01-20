import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
    const { user, username } = { user: true, username: true };

    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link href='/' passHref>
                        <button className='btn-logo'>Feed</button>
                    </Link>
                </li>

                {/* User is signed in and has an username */}
                {username && (
                    <>
                        <li className='push-left'>
                            <Link href='/admin' passHref>
                                <button className='btn-blue'>
                                    Write Posts
                                </button>
                            </Link>
                        </li>
                        <li>
                            <Link href={`/${username}`} passHref>
                                {/* <Image
                                    src={user?.photoURL}
                                    alt='user photo'
                                    width={50}
                                    height={50}
                                    objectFit='cover'
                                /> */}
                                image
                            </Link>
                        </li>
                    </>
                )}

                {/* User is not signed in or has no username */}
                {!username && (
                    <li>
                        <Link href='/enter' passHref>
                            <button className='btn-blue'>Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
