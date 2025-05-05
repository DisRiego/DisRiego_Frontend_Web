import { useEffect, useState } from "react";
import { data, useParams } from "react-router-dom";
import axios from "axios";
import Head from "../reusable/Head";
import Table from "../reusable/Table";

const Billing_detail = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});
  const [dataConcept, setDataConcept] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dots, setDots] = useState("");
  const [loading, setLoading] = useState("");
  const [loadingTable, setLoadingTable] = useState(false);

  const head_data = {
    title: `Ver Detalles de la Factura #${id}`,
    description:
      "En esta sección, puedes visualizar la información de la factura generada.",
  };

  const columns = [
    "Concepto",
    "Descripción",
    "Valor unitario",
    "Cantidad",
    "Valor total",
  ];

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
              <p className="has-text-weight-bold">Referencia de pago</p>
              <p className="is-size-5 has-text-weight-bold">[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Valor de la transacción</p>
              <p className="is-size-5 has-text-weight-bold">[]</p>
            </div>
            <div className="cell">
              <p className="has-text-weight-bold">Fecha de pago</p>
              <p className="is-size-5 has-text-weight-bold">[]</p>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed-grid has-2-cols-desktop has-1-cols-mobile">
        <div className="grid">
          <div className="cell rol-detail">
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
          <div className="cell rol-detail">
            <div className="columns is-multiline is-mobile">
              <div className="column column-p0">Nombre del usuario</div>
              <div className="column column-p0">[Nombre del usuario]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column column-p0">No. Documento</div>
              <div className="column column-p0">[No. Documento]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column column-p0">Correo electrónico</div>
              <div className="column column-p0">[Correo electrónico]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column column-p0">ID del predio</div>
              <div className="column column-p0">[ID del predio]</div>
            </div>
            <div className="columns is-multiline is-mobile">
              <div className="column">ID del lote</div>
              <div className="column">[ID del lote]</div>
            </div>
          </div>
        </div>
      </div>
      <Table columns={columns} data={dataConcept} loadingTable={loadingTable} />
    </>
  );
};

export default Billing_detail;
