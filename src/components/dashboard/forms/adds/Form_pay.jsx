import { useState } from "react";
import { FiLock } from "react-icons/fi";

const Form_pay = () => {
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="container is-max-tablet">
      <h2 className="title is-4 has-text-centered">
        ¿Cómo te gustaría pagar tu factura?
      </h2>
      <p className="has-text-centered mb-5">
        Elige la forma de pago que prefieras para tu factura. Completa la
        información requerida para procesar tu pago de manera rápida y segura
      </p>

      <div className="rol-detail mt-6">
        <label className="label">Opciones de pago</label>

        {/* Tarjeta de crédito */}
        <div className="field">
          <div className="control">
            <label className="radio">
              <input
                type="radio"
                name="payment"
                value="credit"
                checked={selectedOption === "credit"}
                onChange={() => setSelectedOption("credit")}
              />
              &nbsp;Tarjeta de crédito
            </label>
          </div>
        </div>

        {selectedOption === "credit" && (
          <div className="mt-3">
            <div className="columns">
              <div className="column is-two-thirds">
                <div className="field">
                  <label className="label">Nombre y apellido</label>
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
                  <div className="control">
                    <input
                      className="input"
                      type="text"
                      placeholder="MM / AA"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="columns">
              <div className="column is-two-thirds">
                <div className="field">
                  <label className="label">Número de la tarjeta</label>
                  <div className="control">
                    <input
                      className="input"
                      type="number"
                      placeholder="1234 1234 1234 1234"
                    />
                  </div>
                </div>
              </div>
              <div className="column">
                {" "}
                <div className="field-body">
                  <div className="field">
                    <label className="label">Código de seguridad</label>
                    <div className="control">
                      <input
                        className="input"
                        type="password"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">¿En cuántas cuotas desea pagar?</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select>
                    <option>1 cuota</option>
                    <option>3 cuotas</option>
                    <option>6 cuotas</option>
                    <option>12 cuotas</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tarjeta de débito */}
        <div className="field mt-4">
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
          </div>
        </div>

        {selectedOption === "debit" && (
          <div className="notification is-light is-info mt-2">
            Paga directamente con tu tarjeta de débito. Asegúrate de que tu
            tarjeta esté habilitada para pagos en línea y tenga saldo
            disponible.
          </div>
        )}

        {/* PSE */}
        <div className="field mt-4">
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
          </div>
        </div>

        {selectedOption === "pse" && (
          <div className="notification is-light is-link mt-2">
            Serás redirigido al sitio web seguro para completar tu pago mediante
            transferencia bancaria.
          </div>
        )}

        <div className="has-text-grey-light is-size-7 mt-4 has-text-centered">
          <span className="icon is-small">
            <FiLock />
          </span>
          <span>
            Protegemos tu información de pago utilizando encriptación para
            garantizar la seguridad a nivel bancario.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Form_pay;
