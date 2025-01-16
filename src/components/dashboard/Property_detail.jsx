import { useNavigate } from "react-router-dom";

const Property_detail = () => {
    const navigate = useNavigate();

    const handleOnClick = async () => {
        navigate("lot/detail/1");
      };
  return (
    <>
        <h1>Esta viendo los detalles del predio</h1>
        <button className="button" onClick={handleOnClick}>Ver detalles lote</button>
    </>
  )
}

export default Property_detail