import { useEffect, useState } from "react";
import Head from "./Head";

const Profile = () => {
  const head_data = {
    title: "Mi perfil",
    description:
      "En esta sección podrás visualizar y editar tu información personal",
  };
  return (
    <>
      <Head head_data={head_data} />
      <h1>Perfil</h1>
    </>
  );
};

export default Profile;
