import Head from "./Head";

const Notification = () => {
  const data = {
    title: "Mis Notificaciones",
    buttons: {
      button1: {
        icon: "MdDownloadDone",
        class: "",
        text: "Marcar todo como leido",
      },
    },
  };
  return (
    <>
      <Head data={data} />
    </>
  );
};

export default Notification;
