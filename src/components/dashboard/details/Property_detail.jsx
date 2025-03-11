import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bar, Line } from 'react-chartjs-2';
import '../../../styles/index.css';
import Head from "../Head";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, subDays, subWeeks, subMonths, subYears } from 'date-fns';

// componentes de Chart.js usados en el componente
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Property_detail = () => {
  
  const { id } = useParams();
  const [loading, setLoading] = useState("");
  const handleButtonClick = (buttonText) => {
    if (buttonText === "Añadir lote") {
      setShowForm(true);
    }

    if (buttonText === "Descargar reporte") {
      setLoading("is-loading");
      generateReport();
    }
  };

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('consumo'); // 'consumo' o 'produccion'
  const [activePeriod, setActivePeriod] = useState('mes'); // 'dia', 'semana', 'mes', 'año'
  const [activePeriodRight, setActivePeriodRight] = useState('año'); // Para el gráfico de la derecha

  const handleOnClick = async () => {
    navigate("lot/1");
  };

  // Función para generar etiquetas de fecha según el período seleccionado
  const generateDateLabels = (period) => {
    const today = new Date();
    let labels = [];
    let format_str = '';
    
    switch(period) {
      case 'dia':
        // Últimos 30 días
        format_str = 'dd MMM';
        for (let i = 29; i >= 0; i--) {
          labels.push(format(subDays(today, i), format_str));
        }
        break;
      case 'semana':
        // Últimas 8 semanas
        format_str = "'Sem' w";
        for (let i = 7; i >= 0; i--) {
          labels.push(format(subWeeks(today, i), format_str));
        }
        break;
      case 'mes':
        // Últimos 7 meses
        format_str = 'MMM';
        for (let i = 6; i >= 0; i--) {
          labels.push(format(subMonths(today, i), format_str));
        }
        break;
      case 'año':
        // Últimos 5 años
        format_str = 'yyyy';
        for (let i = 4; i >= 0; i--) {
          labels.push(format(subYears(today, i), format_str));
        }
        break;
      default:
        return [];
    }
    return labels;
  };

  // Función para generar datos aleatorios según el período y número de etiquetas
  const generateRandomData = (numLabels, min = 10, max = 100) => {
    return Array.from({ length: numLabels }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  };

  // Función para obtener datos según el tipo (consumo/producción) y período (día/semana/mes/año)
  const getChartData = (type, period) => {
    const labels = generateDateLabels(period);
    const numDataPoints = labels.length;
    
    if (type === 'consumo') {
      return {
        labels,
        datasets: [
          {
            label: 'Agua',
            data: generateRandomData(numDataPoints, 5, 90),
            borderColor: 'rgb(108, 158, 255)',
            backgroundColor: 'rgba(108, 158, 255, 0.3)',
            tension: 0,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 1,
          },
          {
            label: 'Energía',
            data: generateRandomData(numDataPoints, 15, 95),
            borderColor: 'rgb(196, 157, 40)',
            backgroundColor: 'rgba(196, 157, 40, 0.3)',
            tension: 0,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 1,
          },
        ]
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: 'Baterías',
            data: generateRandomData(numDataPoints, 15, 80),
            borderColor: 'rgb(65, 139, 96)',
            backgroundColor: 'rgba(65, 139, 96, 0.3)',
            tension: 0,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 1,
          },
          {
            label: 'Paneles',
            data: generateRandomData(numDataPoints, 20, 75),
            borderColor: 'rgb(225, 149, 142)',
            backgroundColor: 'rgba(225, 149, 142, 0.4)',
            tension: 0,
            pointStyle: 'circle',
            pointRadius: 5,
            pointHoverRadius: 10,
            borderWidth: 1,
          },
        ]
      };
    }
  };

  // Función para obtener datos de barras según el tipo (consumo/producción) y período (día/semana/mes/año) 
  const getBarChartData = (type, period) => {
    const labels = generateDateLabels(period);
    const numDataPoints = labels.length;
    
    if (type === 'consumo') {
      return {
        labels,
        datasets: [
          {
            label: 'Agua',
            data: generateRandomData(numDataPoints, 30, 100),
            backgroundColor: 'rgba(91, 147, 255, 0.8)',
            stack: 'Stack 0',
          },
          {
            label: 'Energía',
            data: generateRandomData(numDataPoints, 10, 50),
            backgroundColor: 'rgba(255, 236, 182, 1)',
            stack: 'Stack 0',
          },
        ]
      };
    } else {
      return {
        labels,
        datasets: [
          {
            label: 'Baterías',
            data: generateRandomData(numDataPoints, 40, 90),
            backgroundColor: 'rgba(65, 139, 96, 0.8)',
            stack: 'Stack 0',
          },
          {
            label: 'Paneles',
            data: generateRandomData(numDataPoints, 10, 40),
            backgroundColor: 'rgba(225, 149, 142, 0.8)',
            stack: 'Stack 0',
          },
        ]
      };
    }
  };

  // Configuraciones para los gráficos
  const getLineOptions = (period) => {
    let titleText = 'Niveles de consumo';
    if (activeTab === 'produccion') {
      titleText = 'Niveles de producción';
    }
    
    switch(period) {
      case 'dia': 
        titleText += ' diario (últimos 30 días)';
        break;
      case 'semana': 
        titleText += ' semanal (últimas 8 semanas)';
        break;
      case 'mes': 
        titleText += ' mensual (últimos 7 meses)';
        break;
      case 'año': 
        titleText += ' anual (últimos 5 años)';
        break;
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: titleText,
          font: {
            size: 14
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  };

  const getBarOptions = (period) => {
    let titleText = 'Niveles de consumo';
    if (activeTab === 'produccion') {
      titleText = 'Niveles de producción';
    }
    
    switch(period) {
      case 'dia': 
        titleText += ' diario (últimos 30 días)';
        break;
      case 'semana': 
        titleText += ' semanal (últimas 8 semanas)';
        break;
      case 'mes': 
        titleText += ' mensual (últimos 7 meses)';
        break;
      case 'año': 
        titleText += ' anual (últimos 5 años)';
        break;
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: titleText,
          font: {
            size: 14
            
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          stacked: true
        },
        x: {
          stacked: true
        }
      }
    };
  };
  
  // Definir los valores para las tarjetas resumen
  const summaryCards = activeTab === 'consumo' 
    ? [
        { title: 'Consumo promedio de energía', valueUptakeEnergy: '155 kWh', bgColor: 'rgba(252,241,210,1)' },
        { title: 'Consumo actual de energía', valueUptakeEnergy: '132 kWh', bgColor: 'rgba(252,241,210,1)' },
        { title: 'Consumo promedio de agua', valueUptakeWater: '245 m³', bgColor: 'rgba(91,147,255,0.15)' },
        { title: 'Consumo actual de agua', valueUptakeWater: '265 m³', bgColor: 'rgba(91,147,255,0.15)' }
      ]
    : [
        { title: 'Energía almacenada (Baterías)', valueStorageEnergy: '155 kWh', bgColor: 'rgba(239,249,217,1)' },
        { title: 'Autonomía restante (Baterías)', valueStorageEnergy: '2h', bgColor: 'rgba(239,249,217,1)' },
        { title: 'Producción mensual de energía', valueProductionEnergy: '155 kWh', bgColor: 'rgba(229,135,127, 0.4)' },
        { title: 'Producción actual de energía', valueProductionEnergy: '132 kWh', bgColor: 'rgba(229,135,127, 0.4)' }
      ];
      const head_data = {
        title: "Detalles del predio #" + id,
        description:
          "En esta sección podrás visualizar información detallada sobre el predio.",
        buttons: {
          button1: {
            icon: "FaPlus",
            class: "color-hover",
            text: "Añadir lote",
          },
          button2: {
            icon: "LuDownload",
            class: "",
            text: "Descargar reporte",
          },
        },
      };

  return (
    <div className="property-detail-container">
    <>
      <Head
        head_data={head_data}
        onButtonClick={handleButtonClick}
        loading={loading}
      />
    </>
      <div className="box">
        <div className="is-flex is-justify-content-space-between is-align-items-center mb-4">
          <h2 className="title is-5 mb-0">Visualiza las gráficas</h2>
          <div className="tabs is-toggle is-small">
            <ul>
              <li className={activeTab === 'consumo' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('consumo')}>
                  <span>Consumo</span>
                </a>
              </li>
              <li className={activeTab === 'produccion' ? 'is-active' : ''}>
                <a onClick={() => setActiveTab('produccion')}>
                  <span>Producción</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="columns is-multiline mb-5">
          {summaryCards.map((card, index) => (
            <div className="column is-3" key={index}>
              <div className="box p-4" style={{ backgroundColor: card.bgColor, height: '100%' }}>
                <p className="is-size-7 has-text-weight-bold mb-2">{card.title}</p>
                <p className="is-size-4 has-text-weight-bold uptake-value-energy">{card.valueUptakeEnergy}</p>
                <p className="is-size-4 has-text-weight-bold uptake-value-water">{card.valueUptakeWater}</p>
                <p className="is-size-4 has-text-weight-bold storage-value-energy">{card.valueStorageEnergy}</p>
                <p className="is-size-4 has-text-weight-bold production-value-energy">{card.valueProductionEnergy}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pestañas para tiempo: día, semana, mes, año */}
        <div className="columns">
          <div className="column is-6">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
            <h3 className="subtitle is-6 mb-2">Niveles de {activeTab === 'consumo' ? 'consumo' : 'producción'}</h3>
            <div className="tabs is-small tabs-period left">
              <ul>
                <li className={activePeriod === 'dia' ? 'is-active' : ''}>
                  <a onClick={() => setActivePeriod('dia')}>Día</a>
                </li>
                <li className={activePeriod === 'semana' ? 'is-active' : ''}>
                  <a onClick={() => setActivePeriod('semana')}>Semana</a>
                </li>
                <li className={activePeriod === 'mes' ? 'is-active' : ''}>
                  <a onClick={() => setActivePeriod('mes')}>Mes</a>
                </li>
                <li className={activePeriod === 'año' ? 'is-active' : ''}>
                  <a onClick={() => setActivePeriod('año')}>Año</a>
                </li>
              </ul>
            </div>
            </div>
            <div style={{ height: '250px' }}>
              <Line 
                data={getChartData(activeTab, activePeriod)} 
                options={getLineOptions(activePeriod)} 
              />
            </div>
          </div>
          <div className="column is-6">
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-2">
            <h3 className="subtitle is-6 mb-2">Niveles de {activeTab === 'consumo' ? 'consumo' : 'producción'}</h3>
            <div className="tabs is-small tabs-period right">
              <ul>
                <li className={activePeriodRight === 'dia' ? 'is-active' : ''}>
                  <a onClick={() => setActivePeriodRight('dia')}>Día</a>
                </li>
                <li className={activePeriodRight === 'semana' ? 'is-active' : ''}>
                  <a onClick={() => setActivePeriodRight('semana')}>Semana</a>
                </li>
                <li className={activePeriodRight === 'mes' ? 'is-active' : ''}>
                  <a onClick={() => setActivePeriodRight('mes')}>Mes</a>
                </li>
                <li className={activePeriodRight === 'año' ? 'is-active' : ''}>
                  <a onClick={() => setActivePeriodRight('año')}>Año</a>
                </li>
              </ul>
            </div>
            </div>
            <div style={{ height: '250px' }}>
              <Bar 
                data={getBarChartData(activeTab, activePeriodRight)} 
                options={getBarOptions(activePeriodRight)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property_detail;




