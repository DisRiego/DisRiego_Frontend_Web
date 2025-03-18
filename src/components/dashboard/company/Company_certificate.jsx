import { useEffect, useState } from "react";
import Table from "../Table";
import Pagination from "../Pagination";

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
        serial_number: "001",
        company_nit: "9001234567",
        generation_date: "03/01/2025",
        expiration_date: "10/01/2026",
        attachment: "certificado_001.pdf",
        status: "Activo",
      },
      {
        id: 2,
        serial_number: "002",
        company_nit: "9001234567",
        generation_date: "03/01/2025",
        expiration_date: "10/01/2026",
        attachment: "certificado_002.pdf",
        status: "Expirado",
      },
      {
        id: 3,
        serial_number: "003",
        company_nit: "9001234567",
        generation_date: "03/01/2025",
        expiration_date: "10/01/2026",
        attachment: "certificado_003.pdf",
        status: "Activo",
      },
      {
        id: 4,
        serial_number: "004",
        company_nit: "9001234567",
        generation_date: "05/01/2025",
        expiration_date: "12/01/2026",
        attachment: "certificado_004.pdf",
        status: "Activo",
      },
      {
        id: 5,
        serial_number: "005",
        company_nit: "9001234567",
        generation_date: "07/01/2025",
        expiration_date: "14/01/2026",
        attachment: "certificado_005.pdf",
        status: "Expirado",
      },
      {
        id: 6,
        serial_number: "006",
        company_nit: "9001234567",
        generation_date: "09/01/2025",
        expiration_date: "16/01/2026",
        attachment: "certificado_006.pdf",
        status: "Activo",
      },
      {
        id: 7,
        serial_number: "007",
        company_nit: "9001234567",
        generation_date: "11/01/2025",
        expiration_date: "18/01/2026",
        attachment: "certificado_007.pdf",
        status: "Activo",
      },
      {
        id: 8,
        serial_number: "008",
        company_nit: "9001234567",
        generation_date: "13/01/2025",
        expiration_date: "20/01/2026",
        attachment: "certificado_008.pdf",
        status: "Expirado",
      },
      {
        id: 9,
        serial_number: "009",
        company_nit: "9001234567",
        generation_date: "15/01/2025",
        expiration_date: "22/01/2026",
        attachment: "certificado_009.pdf",
        status: "Activo",
      },
      {
        id: 10,
        serial_number: "010",
        company_nit: "9001234567",
        generation_date: "17/01/2025",
        expiration_date: "24/01/2026",
        attachment: "certificado_010.pdf",
        status: "Activo",
      },
      {
        id: 11,
        serial_number: "011",
        company_nit: "9001234567",
        generation_date: "19/01/2025",
        expiration_date: "26/01/2026",
        attachment: "certificado_011.pdf",
        status: "Expirado",
      },
      {
        id: 12,
        serial_number: "012",
        company_nit: "9001234567",
        generation_date: "21/01/2025",
        expiration_date: "28/01/2026",
        attachment: "certificado_012.pdf",
        status: "Activo",
      },
      {
        id: 13,
        serial_number: "013",
        company_nit: "9001234567",
        generation_date: "23/01/2025",
        expiration_date: "30/01/2026",
        attachment: "certificado_013.pdf",
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
      ID: cert.id,
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
    { icon: "BiEditAlt", name: "Editar" },
    { icon: "MdOutlineCheckCircle", name: "Habilitar" },
    { icon: "MdDisabledVisible", name: "Inhabilitar" },
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
      <Pagination
        totalItems={filteredData.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

export default Company_certificate;
