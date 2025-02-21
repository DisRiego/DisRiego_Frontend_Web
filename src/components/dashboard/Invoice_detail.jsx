import { useNavigate, useParams } from "react-router-dom";

const Invoice_detail = () => {
  const { id } = useParams();
  const navegation = useNavigate();

  const handleOnClick = async () => {
    navegation("/dashboard/report");
  };
  return (
    <>
      <h1>Detalle de la Factura #{id}</h1>
      <button className="button" onClick={handleOnClick}>
        Volver
      </button>
    </>
  );
};

export default Invoice_detail;
