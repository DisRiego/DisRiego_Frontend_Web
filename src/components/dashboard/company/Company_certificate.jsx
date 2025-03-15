import { useEffect, useState } from "react";
import Table from "../Table";

const Company_certificate = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [loadingTable, setLoadingTable] = useState(false);

  const fetchCertificates = async () => {
    const mockData = [
      {
        id: 1,
        serial_number: "CERT-001",
        company_nit: "900123456-7",
        generation_date: "2025-03-01",
        expiration_date: "2026-03-01",
        attachment: "certificado_001.pdf",
        status: "Activo",
      },
      {
        id: 2,
        serial_number: "CERT-002",
        company_nit: "900123456-7",
        generation_date: "2025-02-15",
        expiration_date: "2026-02-15",
        attachment: "certificado_002.pdf",
        status: "Expirado",
      },
      {
        id: 3,
        serial_number: "CERT-003",
        company_nit: "900123456-7",
        generation_date: "2025-01-10",
        expiration_date: "2026-01-10",
        attachment: "certificado_003.pdf",
        status: "Activo",
      },
    ];

    setData(mockData);
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredData = data
    .filter((cert) =>
      Object.values(cert)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .map((cert) => ({
      "Numéro de serie": cert.serial_number,
      "Nit empresa": cert.company_nit,
      "Fecha de generación": cert.generation_date,
      "Fecha de expiración": cert.expiration_date,
      Adjunto: cert.attachment,
      Estado: cert.status,
    }));

  const columns = [
    "Numéro de serie",
    "Nit empresa",
    "Fecha de generación",
    "Fecha de expiración",
    "Adjunto",
    "Estado",
    "Opciones",
  ];

  const options = [
    { icon: "BiEditAlt", name: "Editar certificado" },
    { icon: "MdDisabledVisible", name: "Inhabilitar certificado" },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <Table
        columns={columns}
        data={paginatedData}
        options={options}
        loadingTable={loadingTable}
      />
    </>
  );
};

export default Company_certificate;
