import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcDinersClub,
  FaCcJcb,
  FaCreditCard,
} from "react-icons/fa";
import { FiLock } from "react-icons/fi";

const getCardType = (number) => {
  const cleaned = number.replace(/\s/g, "");

  if (/^4\d{0,15}/.test(cleaned)) return "visa";

  // Mastercard: 51–55 or 2221–2720
  if (
    /^5[1-5]/.test(cleaned) ||
    /^2(2[2-9][1-9]|2[3-9]\d|[3-6]\d{2}|7([01]\d|20))/.test(cleaned)
  )
    return "mastercard";

  if (/^3[47]/.test(cleaned)) return "amex";
  if (/^6(?:011|5|4[4-9])/.test(cleaned)) return "discover";
  if (/^3(?:0[0-5]|[689]|9)/.test(cleaned)) return "diners";
  if (/^35(2[89]|[3-8][0-9])/.test(cleaned)) return "jcb";
  if (/^(5[06-9]|6[0-9])/.test(cleaned)) return "maestro";

  return "default";
};

const formatCardNumber = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

const Form_pay = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState("default");
  const [cvv, setCvv] = useState("");
  const [bank, setBank] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");

  useEffect(() => {
    fetchBank();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const fetchBank = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_PAYU + import.meta.env.VITE_API_PAYU_GET_BANK,
        {
          language: "es",
          command: "GET_BANKS_LIST",
          merchant: {
            apiLogin: import.meta.env.VITE_API_PAYU_LOGIN,
            apiKey: import.meta.env.VITE_API_KEY_PAYU,
          },
          test: false,
          bankListInformation: {
            paymentMethod: "PSE",
            paymentCountry: "CO",
          },
        }
      );
      setBank(response.data.banks.filter((b) => b.pseCode !== "0"));
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los bancos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpiryInput = (e) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);

    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + "/" + raw.slice(2);
    }

    // Validar si MM es válido
    const [mm, aa] = raw.split("/");
    if (mm && (parseInt(mm) < 1 || parseInt(mm) > 12)) return;

    setExpiry(raw);
  };

  const handleCardInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const detectedType = getCardType(raw);
    const maxLength = getMaxLengthByType(detectedType);
    const trimmed = raw.substring(0, maxLength);
    const formatted = formatCardNumber(trimmed);

    setCardNumber(formatted);
    setCardType(detectedType);
  };

  const getCvvLengthByType = (type) => {
    return type === "amex" ? 4 : 3;
  };

  const handleCvvInput = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const maxLength = getCvvLengthByType(cardType);
    setCvv(raw.slice(0, maxLength));
  };

  const getMaxLengthByType = (type) => {
    switch (type) {
      case "visa":
        return 16;
      case "mastercard":
        return 16;
      case "amex":
        return 15;
      case "discover":
      case "jcb":
      case "maestro":
        return 19;
      case "diners":
        return 14;
      default:
        return 19;
    }
  };

  const renderCardIcon = () => {
    switch (cardType) {
      case "visa":
        return <FaCcVisa />;
      case "mastercard":
        return <FaCcMastercard />;
      case "amex":
        return <FaCcAmex />;
      case "discover":
        return <FaCcDiscover />;
      case "diners":
        return <FaCcDinersClub />;
      case "jcb":
        return <FaCcJcb />;
      default:
        return <FaCreditCard />;
    }
  };

  const isValidExpiry = (expiry) => {
    const [mm, aa] = expiry.split("/");

    if (!mm || !aa || mm.length !== 2 || aa.length !== 2) return false;

    const current = new Date();
    const year = parseInt("20" + aa);
    const month = parseInt(mm);

    if (month < 1 || month > 12) return false;

    const expiryDate = new Date(year, month - 1, 1);
    return expiryDate >= new Date(current.getFullYear(), current.getMonth(), 1);
  };

  const toTitleCase = (str) => {
    if (typeof str !== "string") return str;
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  return (
    <div className="container is-max-tablet">
      <h2 className="title is-4 has-text-centered">
        ¿Cómo deseas pagar tu factura?
      </h2>
      <p className="has-text-centered mb-5">
        Selecciona tu método de pago preferido y completa los datos necesarios
        para procesar tu transacción de forma rápida y segura.
      </p>

      <div className="rol-detail mt-6 p-5">
        <label className="label">Opciones de pago</label>
        {isLoading ? (
          <div className="rol-detail">
            <div className="loader-cell">
              <div className="loader cont-loader"></div>
              <p className="loader-text">Cargando información{dots}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Tarjeta de débito */}
            <div className="rol-detail field">
              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="payment"
                    value="debit"
                    checked={selectedOption === "debit"}
                    onChange={() => setSelectedOption("debit")}
                  />
                  &nbsp;Tarjeta de débito
                </label>
                {selectedOption != "debit" ? (
                  <p className="description-pay">
                    Realiza el pago directamente con tu tarjeta de débito.
                    Asegúrate de que esté habilitada para pagos en línea y
                    cuente con saldo disponible.
                  </p>
                ) : (
                  <div className="mt-3">
                    <div className="columns">
                      <div className="column is-two-thirds">
                        <div className="field">
                          <label className="label">
                            Nombre y apellido del titular de la tarjeta
                          </label>
                          <div className="control">
                            <input
                              className="input"
                              type="text"
                              placeholder="[Nombre y apellido]"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field">
                          <label className="label">Fecha de vencimiento</label>
                          <input
                            className="input"
                            type="text"
                            placeholder="MM/AA"
                            value={expiry}
                            onChange={handleExpiryInput}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="columns">
                      <div className="column is-two-thirds">
                        <div className="field">
                          <label className="label">Número de la tarjeta</label>
                          <div className="control has-icons-left">
                            <input
                              className="input"
                              type="text"
                              placeholder="XXXX XXXX XXXX XXXX"
                              value={cardNumber}
                              onChange={handleCardInput}
                            />
                            <span className="icon is-left">
                              {renderCardIcon()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="column">
                        <div className="field-body">
                          <div className="field">
                            <label className="label">Código de seguridad</label>
                            <div className="control">
                              <input
                                className="input"
                                type="password"
                                placeholder="•••"
                                value={cvv}
                                onChange={handleCvvInput}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* PSE */}
            <div className="rol-detail field">
              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    name="payment"
                    value="pse"
                    checked={selectedOption === "pse"}
                    onChange={() => setSelectedOption("pse")}
                  />
                  &nbsp;PSE (Transferencia bancaria)
                </label>
                {selectedOption != "pse" ? (
                  <p className="description-pay">
                    Serás redirigido al sitio web de PSE para completar tu pago
                    mediante transferencia bancaria.
                  </p>
                ) : (
                  <>
                    <div className="mt-3">
                      <div className="columns">
                        <div className="column">
                          <div className="field">
                            <label className="label">Banco emisor</label>
                            <div className="control">
                              <div class="select ">
                                <select>
                                  <option value="" disabled>
                                    Seleccione una opción
                                  </option>
                                  {bank.map((bank) => (
                                    <option key={bank.id} value={bank.id}>
                                      {toTitleCase(bank.description)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="has-text-grey-light is-size-7 mt-4 has-text-centered">
              <span className="icon is-small">
                <FiLock />
              </span>
              <span>
                Protegemos tu información de pago con tecnología de encriptación
                avanzada para garantizar tu seguridad en todo momento.
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Form_pay;
