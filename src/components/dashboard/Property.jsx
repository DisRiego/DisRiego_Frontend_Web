import { useNavigate } from "react-router-dom"
import Navegation from "./Navegation";

const Property = () => {
  const navigate = useNavigate();

  const handleOnClick = async () => {
    navigate("1");
  };

  return (
    <>
        <Navegation/>
        <button className="button" onClick={handleOnClick}>Ver detalle predio</button>
    </>
  )
}

export default Property