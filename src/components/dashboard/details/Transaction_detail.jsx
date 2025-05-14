import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import axios from "axios";
import Head from "../reusable/Head";
import Table from "../reusable/Table";

const Transaction_detail = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [dataConcept, setDataConcept] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);

  const head_data = {
    title: `Detalles de la Transacción #${id}`,
    description:
      "En esta sección, encontrarás la información detallada de la transacción.",
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <>
      <Head className="mb-3" head_data={head_data} />
      <div className="rol-detail mb-4">
        <div className="fixed-grid has-4-cols-desktop has-2-cols-mobile">
          <div className="grid">
            <div className="cell">
              <p className="has-text-weight-bold">Método de pago</p>
              <p className="is-size-5 has-text-weight-bold">[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Nombre del titular</p>
              <p className="is-size-5 has-text-weight-bold">[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Valor de la transacción</p>
              <p className="is-size-5 has-text-weight-bold">
                {formatCurrency([])}
              </p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Estado</p>
              <p className="is-size-5 has-text-weight-bold">[]</p>
            </div>
          </div>
        </div>
      </div>
      <div className="rol-detail">
        <div className="columns">
          <div className="column">
            <div className="columns is-multiline is-mobile">
              <div className="column column-p0">No. Factura</div>
              <div className="column column-p0">[No. Factura]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column column-p0">Fecha de emisión</div>
              <div className="column column-p0">[Fecha de emisión]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column column-p0">Fecha de vencimiento</div>
              <div className="column column-p0">[Fecha de vencimiento]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column column-p0">Periodo facturado</div>
              <div className="column column-p0">[Periodo facturado]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column">Total a pagar</div>
              <div className="column">[Total a pagar]</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transaction_detail;
