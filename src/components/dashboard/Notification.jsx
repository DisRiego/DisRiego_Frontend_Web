import Head from "./Head";

const Notification = () => {
  const head_data = {
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
      <Head head_data={head_data} />
    </>
  );
};

export default Notification;
