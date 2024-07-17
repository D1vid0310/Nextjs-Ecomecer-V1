"use client";
import {
  CircleUserRound,
  FileText,
  ImagePlus,
  LifeBuoy,
  LoaderCircle,
  LogOut,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { fileToBase64 } from "@/actions/convertir-file-64";
import { actualizarDoc, salirDelaCuenta, subirArchivo } from "@/lib/firebase";
import toast from "react-hot-toast";
import Image from "next/image";
import { setInLocalstorage } from "@/actions/set-localstore";

export function DropdownMenuDemo() {
  let user = useUser();
  const [img, setimg] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  //FAUNCION PARA ELEGIR IMG Y CARGARLA
  const elegirImg = async (event: any) => {
    const file = event.target.files[0];
    console.log(file);
    setCargando(true);
    try {
      const base64 = await fileToBase64(file);
      const imgPath = `${user?.uid}/profile`;
      const imgUrl = await subirArchivo(imgPath, base64);
      await actualizarDoc(`users/${user?.uid}`, { img: imgUrl });
      setimg(imgUrl);

      //Se guarda la img en local store para cada usuario
      if (user) {
        user.img = imgUrl;
        setInLocalstorage("user", user);
      }

      toast.success("Su imagen se cargo correctamente");

      console.log(imgUrl);
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setCargando(false);
    }
  };

  //Se utiliza useEffect crear la condicion de la img con el usuario
  useEffect(() => {
    //Se muestra el error de la propiedad img pero es solo que se declaro undefined desde el comienzo
    if (user?.img) setimg(user.img);
  }, [user]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <span className="mr-2 ">Mi Cuenta</span>
          {img ? (
            <Image
              className="object-cover w-6 h-6 rounded-full m-auto"
              src={img}
              width={1000}
              height={1000}
              alt="imgdelusuario"
            />
          ) : (
            <CircleUserRound className="m-auto w-6 h-6" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-center">
          {cargando ? (
            <LoaderCircle className="w-14 h-14 animate-spin m-auto mb-3" />
          ) : (
            <>
              {img ? (
                <Image
                  className="object-cover w-20 h-20 rounded-full m-auto"
                  src={img}
                  width={1000}
                  height={1000}
                  alt="imgdelusuario"
                />
              ) : (
                <CircleUserRound className="m-auto w-20 h-20" />
              )}
              <div className="flex justify-center cursor-pointer  relative bottom-2">
                <div className="mt-3">
                  <input
                    id="files"
                    className="hidden"
                    accept="img?/png, img?/webp, img?/jpeg"
                    type="file"
                    onChange={() => elegirImg(event)}
                  />
                  <label htmlFor="files">
                    <div className="  w-[40px] h-[28px] text-white cursor-pointer bg-slate-950 hover:bgsla-800 rounded-lg  flex justify-center items-center">
                      <ImagePlus className="w-[18px] h-[18px] " />
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          <div>{user?.name}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
            <DropdownMenuShortcut></DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Terminos y condiciones</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Soporte</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuItem onClick={() => salirDelaCuenta()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Salir</span>
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
