import Head from "./Head";

const Notification = () => {
  const data = {
    title: "Mis Notificaciones",
    buttons: {
      button1: {
        icon: "MdDownloadDone",
        class: "color-hover",
        text: "Marcar todo como leído",
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
