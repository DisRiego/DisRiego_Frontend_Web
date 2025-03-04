import { useParams } from "react-router-dom";

const Lot_detail = () => {
  const { id } = useParams();
  return (
    <>
      <h1>Esta viendo los detalles del lote #{id}</h1>
    </>
  );
};

export default Lot_detail;
