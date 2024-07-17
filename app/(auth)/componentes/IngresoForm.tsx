"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ingreso } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";

const Formulario = () => {
  const [isCargando, setisCargando] = useState<boolean>(false);

  //Formulario
  const formSchema = z.object({
    email: z
      .string()
      .email(
        "El formato del Correo no es valido. Ejemplo: Administrado@Gamil.com"
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

      let res = await ingreso(user);
      console.log(res);
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setisCargando(false);
    }
  };

  return (
    <>
      <div className=" text-center">
        <h1 className="text-2xl font-semibold">Ingreso</h1>
        <p className="text-sm text-muted-foreground">
          Introduce tu Correo y Contraseña para acceder
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
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
          <Link
            href="/contra"
            className="underline text-muted-foreground underline-offset-4 hover:text-primary mg-6 text-sm text-end"
          >
            Recupera tu contraseña
          </Link>
          {/*=== Boton de submit*/}
          <Button type="submit" disabled={isCargando}>
            {isCargando && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Ingresar
          </Button>
        </div>
      </form>
      {/*=== Registro de usuario*/}
      <p className="text-center text-sm text-muted-foreground">
        {"¿No tienes cuenta? "}
        <Link
          href="/registro"
          className="underline underline-offset-4 hover:text-primary"
        >
          Registrate
        </Link>
      </p>
    </>
  );
};

export default Formulario;
