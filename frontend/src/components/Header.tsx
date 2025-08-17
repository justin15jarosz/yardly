import { isLoggedIn, logout } from '@/utils/auth';
import { Button } from './ui/button';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter()

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-green-500 shadow">
      <Link
        href={"/"}
        className={`${"/" === pathname && "text-2xl font-bold text-gray-800"
          } capitalize font-medium hover:text-accent transition-all`}
      >
        Yardly
      </Link>
      {isLoggedIn() ? (
        <Button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </Button>
      ) : (

        <Link
          href={"/login"}
          className={`${"/login" === pathname && "text-accent border-b-2 border-accent"
            } capitalize font-medium hover:text-accent transition-all`}
        >
          Login
        </Link>
      )}
    </header>
  );
};

export default Header;