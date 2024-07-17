"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { actualizarName, registro, setDoct } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { User } from "@/interfaces/user.interfaces";

const Formulario = () => {
  const [isCargando, setisCargando] = useState<boolean>(false);

  //Mensajes de Validacion del formulario
  const formSchema = z.object({
    uid: z.string(),
    name: z.string().min(4, {
      message: "Este campo es requerido y debe de tener minimo 4 caracteres",
    }),
    email: z
      .string()
      .email(
        "El formato del Correo no es valido. Ejemplo: Administrado@gmail.com"
      )
      .min(1, {
        message: "Este campo es requerido",
      }),
    contraseña: z.string().min(6, {
      message: "Son 6 caracteres minimos como contraseña",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uid: "",
      name: "",
      email: "",
      contraseña: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  //funcion para acceder desde boton
  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    console.log(user);
    try {
      setisCargando(true);

      let res = await registro(user);
      await actualizarName({
        displayName: user.name,
      });

      user.uid = res.user.uid;
      await crearUsearioDb(user as User);
      console.log(res);
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setisCargando(false);
    }
  };

  //Crear usuario en la base de datos - FireBase
  const crearUsearioDb = async (user: User) => {
    //constante path el cual indica donde se guarada el docuemnto
    const path = `users/${user.uid}`;
    setisCargando(true);
    try {
      //Se elimina la contraseña, cual no se requiere visualizar en la BD
      delete user.contraseña;
      await setDoct(path, user);

      toast(`Usuario,${user.name}, Creado con Exito`, { icon: "" });
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setisCargando(false);
    }
  };

  return (
    <>
      <div className=" text-center">
        <h1 className="text-2xl font-semibold">Registro</h1>
        <p className="text-sm text-muted-foreground">
          Introduce tu Correo y Contraseña para Registrarte
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          {/*Input del Nombre*/}
          <div className="mb-3">
            <Label htmlFor="email">Nombre</Label>
            <Input
              {...register("name")}
              id="name"
              placeholder="Administrador"
              autoComplete="name"
              type="text"
            />
            {errors.name && <p className="form-error">{errors.name.message}</p>}
          </div>
          {/*Input de Correo electronico*/}
          <div className="mb-3">
            <Label htmlFor="email">Correo</Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="Correo@gmail.com"
              autoComplete="email"
            />
            {errors.email && (
              <p className="form-error">{errors.email.message}</p>
            )}
          </div>
          {/*Input de Contraseña*/}
          <div className="mb-3">
            <Label htmlFor="contraseña">Contraseña</Label>
            <Input
              {...register("contraseña")}
              id="contraseña"
              type="password"
              placeholder="*******"
            />
            {errors.contraseña && (
              <p className="form-error">{errors.contraseña.message}</p>
            )}
          </div>

          {/*=== Boton de submit*/}
          <Button type="submit" disabled={isCargando}>
            {isCargando && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Crear
          </Button>
        </div>
      </form>
      {/*=== Registro de usuario*/}
      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          Acceder
        </Link>
      </p>
    </>
  );
};

export default Formulario;
