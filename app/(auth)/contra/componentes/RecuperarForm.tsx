"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enviodeGmal, ingreso } from "@/lib/firebase";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Formulario = () => {
  const [isCargando, setisCargando] = useState<boolean>(false);
  const rauter = useRouter();

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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  //funcion para acceder desde boton
  const onSubmit = async (user: z.infer<typeof formSchema>) => {
    setisCargando(true);
    try {
      await enviodeGmal(user.email);
      toast.success("Correo enviado con exito");
      rauter.push("/");
    } catch (error: any) {
      toast.error(error.message, { duration: 2500 });
    } finally {
      setisCargando(false);
    }
  };

  return (
    <div className="md:border border-solid border-gray-50-300 rounded-xl p-10">
      <div className=" text-center">
        <h1 className="text-2xl font-semibold">Recupera tu Contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Introduce tu Correo para recuperar tu contraseña
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2  mt-3">
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

          {/*=== Boton de submit*/}
          <Button type="submit" disabled={isCargando}>
            {isCargando && (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            )}
            Recuperar
          </Button>
        </div>
      </form>
      {/*=== Registro de usuario*/}
      <p className="text-center text-sm text-muted-foreground mt-3">
        <Link
          href="/"
          className="underline underline-offset-4 hover:text-primary"
        >
          Acceder
        </Link>
      </p>
    </div>
  );
};

export default Formulario;
