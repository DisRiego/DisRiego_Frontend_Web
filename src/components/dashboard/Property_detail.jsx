import { useNavigate, useParams } from "react-router-dom";

const Property_detail = () => {
  const { id } = useParams();
    const navigate = useNavigate();

    const handleOnClick = async () => {
        navigate("lot/1");
      };
  return (
    <>
        <h1>Esta viendo los detalles del predio #{id}</h1>
        <button className="button" onClick={handleOnClick}>Ver detalles lote</button>
    </>
  )
}

export default Property_detail