import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import Logo from "./logo";
import { DropdownMenuDemo } from "./Perfil";

const Navbar = () => {
  return (
    <div className="flex justify-between mx-6 mb-10 lg:mx-20 py-6 border-b border-solid border-gray-200 md:border-b-0">
      <Logo />
      <div className="">
        <DropdownMenuDemo />
      </div>
    </div>
  );
};

export default Navbar;
