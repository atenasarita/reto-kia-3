import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";
import "../styles/WasteRegistry.css";

const type = [
  "Trapos, guantes y textiles contaminados con aceite hidráulico, pintura, thinner y grasa provenientes de actividades de limpieza, operación y mantenimiento",
  "Plásticos contaminados con aceite hidráulico y pintura provenientes de actividades de limpieza y operación",
  "Papel contaminado con pintura proveniente de la actividad de retoque de carrocerías",
  "Tambos vacíos metálicos contaminados con aceite hidráulico, líquidos para frenos y sello",
  "Tambos vacíos plásticos contaminados con limpiadores con base de hidróxido de potasio",
  "Lodos de fosfatizado proveniente de la lavadora de fosfatizado",
  "Contenedores vacíos metálicos contaminados de pintura de aceite, aceite hidráulico y sello",
  "Contenedores vacíos plásticos contaminados de pintura de aceite y aceite hidráulico",
  "Aceite gastado proveniente de los mantenimientos realizados a los equipos",
  "Solventes mezclados con base de thinner provenientes de las actividades de limpieza y/o los mantenimientos realizados a los equipos",
  "Totes contaminados plásticos con aceite hidráulico",
  "Agua contaminada con pintura proveniente de la aplicación a las carrocerías",
  "Filtros contaminados con pigmentos y agua provenientes de la planta tratadora de aguas residuales",
  "Sello gastado: proveniente de la aplicación de sellos a carcazas",
  "Residuos no anatómicos: algodón, gasas, vendas, sábanas, guantes provenientes de curaciones",
  "Objetos punzocortantes provenientes de procedimientos médicos: lancetas, agujas, bisturís",
  "Pilas alcalinas",
  "Baterías de equipos automotores",
  "Lodos de clara provenientes de residuos de casetas de pintura",
  "Rebaba y eslinga metálica impregnada con aceite proveniente del mantenimiento a troqueles",
  "Lámparas fluorescentes",
  "Filtros contaminados con pigmentos y agua provenientes de la planta de pintura",
  "Contenedores vacíos metálicos de gases refrigerantes",
  "Catalizadores gastados de equipos automotores",
  "Baterías automotrices de metal litio"
];
const contenedores = ['Paca', 'Pieza', 'Tambo', 'Tarima', 'Tote'];
const areas = ['Assembly', 'HO', 'Paint', 'PTAR', 'Stamping', 'Utility', 'Vendors', 'Welding'];
const art17 = ['Confinamiento', 'Co-procesamiento', 'Reciclaje'];
const reason_art71 = ['LAURA MIREYA NAVARRO CEPEDA', 'SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.', 'ECO SERVICIOS PARA GAS S.A. DE CV.', 'CONDUGAS DEL NORESTE S.A. DE C.V.'];
const aut_semarnat = ['19-I-030-D-19', '19-I-001-D-16', '19-I-009-D-18', '19-I-031-D-19'];
const aut_SCT = ['1938SAI07062011230301029', '1938CNO08112011230301036', '1938ESG28112011230301000', '1938NACL13102022230303000', '1938NACL29052015073601001'];
const reason_destination = ['BARRILES METALICOS S.A. de C.V.', 'SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.', 'ECO SERVICIOS PARA GAS S.A. DE CV.', 'ECOQUIM S.A. DE C.V.', 'MAQUILADORA DE LUBRICANTES S.A. DE C.V.', 'ELECTRICA AUTOMOTRIZ OMEGA S.A. DE C.V.', 'Geocycle México, S.A. de C.V.','Veolia Soluciones Industriales México, SA de CV','RETALSA SA de CV'];
const aut_destination = ['19-V-62-16', '19-II-004-D-2020', '19-IV-69-16', '19-IV-21-18', '19-21-PS-V-04-94'];
const chemicals = ['C', 'R', 'E', 'T', 'Te', 'Th', 'Tt', 'I', 'B', 'M'];
const responsible = ['Yamileth Cuellar'];



const defaultValuesMap = {
  "Trapos, guantes y textiles contaminados con aceite hidráulico, pintura, thinner y grasa provenientes de actividades de limpieza, operación y mantenimiento": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Geocycle México, S.A. de C.V.",
      art71: "Co-procesamiento",
      chemicals: ['T']
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS S.A. DE CV.",
      aut_semarnat: "19-I-009-D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    }
  ],

  "Plásticos contaminados con aceite hidráulico y pintura provenientes de actividades de limpieza y operación":  {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. de C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: "Geocycle México, S.A. de C.V.",
    art71: "Co-procesamiento",
    chemicals: ['T']
  },

  "Papel contaminado con pintura proveniente de la actividad de retoque de carrocerías": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: "Geocycle México, S.A. de C.V.",
    art71: "Co-procesamiento",
    chemicals: ['T']
  },

  "Tambos vacíos metálicos contaminados con aceite hidráulico, líquidos para frenos y sello": {
    reason_art71: "LAURA MIREYA NAVARRO CEPEDA",
    aut_semarnat: "19-I-001D-16",
    reason_destination: "BARRILES METALICOS S.A. de C.V.",
    art71: "Reciclaje",
    chemicals: ['T']
  },

  "Tambos vacíos plásticos contaminados limpiadores con base de hidróxido de potasio": [
    {
      // Option 1:
      reason_art71: "LAURA MIREYA NAVARRO CEPEDA",
      aut_semarnat: "19-I-001D-16",
      reason_destination: "BARRILES METALICOS S.A. de C.V.",
      art71: "Reciclaje",
      chemicals: ['T']
    },

    {
      // Option 2:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030D-19",
      reason_destination: "RETALSA SA de CV",
      art71: "Reciclaje",
    },

    {
      // Option 3:
      reason_art71: "ECO SERVICIOS PARA GAS S.A. DE CV.",
      aut_semarnat: "19-I-009-D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    }
  ],

  "Lodos de Fosfatizado proveniente de la lavadora de fosfatizado": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
    art71: "Confinamiento",
    chemicals: ['C','T']
  },

  "Contenedores vacíos metálicos contaminados de pintura de aceite, aceite hidráulico y sello": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV ",
      art71: "Confinamiento",
      chemicals: ['T']
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS S.A. DE CV.",
      aut_semarnat: "19-I-009-D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
      chemicals: ['T']
    }
  ],

  "Contenedores vacíos plásticos contaminados de pintura de aceite y aceite hidráulico": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: ["Geocycle México, S.A. de C.V.", "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)"],
    art71: "Confinamiento",
    chemicals: ['T']
  },
  
  "Aceite gastado proveniente de los mantenimientos realizados a los equipos": [
    {
      // Option 1:
      reason_art71: "LAURA MIREYA NAVARRO CEPEDA ",
      aut_semarnat: "19-I-001D-16",
      reason_destination: "MAQUILADORA DE LUBRICANTES S.A. DE C.V.",
      art71: ["Reciclaje", "Co-procesamiento"],
      chemicals: ['T']
    },
    {
      // Option 2:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Asfaltos Energex SA de CV",
      art71: ["Reciclaje", "Co-procesamiento"],
    }
  ],

  "Solventes mezclados con base de thinner provenientes de las actividades de limpieza y/o los mantenimientos realizados a los equipos": [
    {
      // Option 1:
      reason_art71: "CONDUGAS DEL NORESTE, S.A DE C.V",
      aut_semarnat: "19-I-031D-19",
      reason_destination: "ECOQUIM S.A DE C.V",
      art71: "Reciclaje",
      chemicals: ['T', 'I']
    },
    {
      // Option 2:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)",
      art71: ["Reciclaje", "Co-procesamiento"],
    }
  ],

  "Totes contaminados plásticos con aceite hidráulico": {
    reason_art71: "LAURA MIREYA NAVARRO CEPEDA",
    aut_semarnat: "19-I-001D-16",
    reason_destination: "BARRILES METALICOS S.A. de C.V.",
    art71: "Reciclaje",
    chemicals: ['T']
  },

  "Agua contaminada con pintura proveniente de la aplicación a las carrocerías": [{
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "AQUAREC, SAPI de CV",
      art71: "Co-procesamiento",
      chemicals: ['T']
    },
    {
      // Option 2:
      reason_art71: "CONDUGAS DEL NORESTE, S.A DE C.V",
      aut_semarnat: "19-I-031D-19",
      reason_destination: "ECO SERVICIOS PARA GAS S.A. DE C.V.",
      art71: "Co-procesamiento",
    }
  ],

  "Filtros contaminados con pigmentos y agua provenientes de la planta tratadora de aguas residuales": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: ["Geocycle México, S.A. de C.V.", "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)"],
    art71: "Co-procesamiento",
    chemicals: ['T']
  },

  "Sello gastado: proveniente de la aplicación de sellos a carcazas": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: ["Geocycle México, S.A. de C.V.", "Sociedad Ecológica Mexicana del Norte SA"],
      art71: ["Co-procesamiento", "Confinamiento"],
      chemicals: ['T']
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
      art71: "Confinamiento",
    }
  ],

  "Residuos no anatómicos: algodón, gasas, vendas, sábanas, guantes provenientes de curaciones": {
    reason_art71: "C. JAIME ISAAC MORENO VILLAREAL",
    aut_semarnat: "5-27-PS-I-316D-11-2017",
    reason_destination: "Roberto Arturo Muñoz del Río",
    art71: "Destrucción Térmica",
    chemicals: ['M']
  },

  "Objetos punzocortantes provenientes de procedimientos médicos: lancetas, agujas, bisturís": {
    reason_art71: "C. JAIME ISAAC MORENO VILLAREAL",
    aut_semarnat: "5-27-PS-I-316D-11-2017",
    reason_destination: "Roberto Arturo Muñoz del Río",
    art71: "Destrucción Térmica",
    chemicals: ['M']
  },

  "Pilas alcalinas": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
      art71: "Confinamiento",
      chemicals: ['T']
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
      art71: "Confinamiento",
    }
  ],

  "Baterías de equipos automotores": {
    reason_art71: "LAURA MIREYA NAVARRO CEPEDA",
    aut_semarnat: "19-I-001D-16",
    reason_destination: "ELÉCTRICA AUTOMOTRIZ OMEGA, SA de CV",
    art71: "Reciclaje",
    chemicals: ['C','T']
  },

  "Lodos de clara provenientes de residuos de casetas de pintura": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)",
    art71: "Co-procesamiento",
    chemicals: ['T']
  },

  "Rebaba y eslinga metálica impregnada con aceite proveniente del mantenimiento a troqueles": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: ["Veolia Soluciones Industriales México, SA de CV", "Sociedad Ecológica Mexicana del Norte SA"],
    art71: "Confinamiento",
    chemicals: ['T']
  },

  "Lámparas Fluorescentes": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: ["Veolia Soluciones Industriales México, SA de CV", "Sociedad Ecológica Mexicana del Norte SA"],
      art71: ["Confinamiento", "Reciclaje"],
      chemicals: ['T']
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Sociedad Ecológica Mexicana del Norte SA",
      art71: "Reciclaje",
    }
  ],

  "Filtros contaminados con pigmentos y agua provenientes de la planta de pintura": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: ["Geocycle México, S.A. de C.V.", "PRO AMBIENTE, S.A. de C.V. (Planta Noreste)"],
      art71: "Confinamiento",
      chemicals: ['T']
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    }
  ],

  "Contenedores metálicos de gases refrigerantes": [
    {
      // Option 1:
      reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
      aut_semarnat: "19-I-030-D-19",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
      chemicals: ['C','T']
    },
    {
      // Option 2:
      reason_art71: "ECO SERVICIOS PARA GAS, S.A. DE C.V.",
      aut_semarnat: "19-I-009D-18",
      reason_destination: "Veolia Soluciones Industriales México, SA de CV",
      art71: "Confinamiento",
    }
  ],

  "Catalizadores gastados de equipos automotores": {
    reason_art71: "SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.",
    aut_semarnat: "19-I-030D-19",
    reason_destination: ["Veolia Soluciones Industriales México, SA de CV", "Sociedad Ecológica Mexicana del Norte SA"],
    art71: "Confinamiento",
    chemicals: ['C','T']
  },

  "Baterías automotrices de metal litio": {
    chemicals: ['C','T']
  }
};


export default function WasteRegistry() {
  const { id } = useParams(); // si hay ID, estamos editando
  const formatDate = (isoString) => {
    if (!isoString) return "";
    return isoString.slice(0, 10);
  };

  const [formData, setFormData] = useState({
    entry_date: null,
    exit_date: null,
    type: null,
    amount: null,
    container: null,
    area: null,
    art71: null,
    reason_art71: null,
    aut_semarnat: null,
    aut_SCT: null,
    reason_destination: null,
    aut_destination: null,
    chemicals: [],
    responsible: null,
  });

  const [mappingIndex] = useState(0);
  const [hasInitializedDefaults, setHasInitializedDefaults] = useState(false);

  const handleChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    if (inputType === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
          ? [...prev[name], value]
          : prev[name].filter((q) => q !== value),
      }));
    } else if (inputType === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const formType = formData.type;

  useEffect(() => {
    if (!id && formType && !hasInitializedDefaults) {
      const mappingData = defaultValuesMap[formType];
      if (mappingData) {
        const defaults = Array.isArray(mappingData)
          ? mappingData[mappingIndex]
          : mappingData;
  
        setFormData((prev) => {
          const update = {};
          Object.entries(defaults).forEach(([key, value]) => {
            if (!prev[key] || prev[key] === "" || (Array.isArray(value) && prev[key].length === 0)) {
              update[key] = value; // guarda el arreglo completo si es `chemicals`
            }
          });          


          return { ...prev, ...update };
        });
        setHasInitializedDefaults(true);
      }
    }
  }, [formType, id, hasInitializedDefaults, mappingIndex]); 
  
  useEffect(() => {
    if (!id) return;
  
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(`/waste/waste-registry/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        const data = res.data;
        setFormData({
          ...data,
          entry_date: data.entry_date === "" ? null : data.entry_date,
          exit_date: data.exit_date === "" ? null : data.exit_date,
          chemicals: Array.isArray(data.chemicals) ? data.chemicals : [],
          amount: data.amount || null,
          type: data.type || "",
          container: data.container || "",
          area: data.area || "",
          art71: data.art71 || "",
          reason_art71: data.reason_art71 || "",
          aut_semarnat: data.aut_semarnat || "",
          aut_SCT: data.aut_sct || "",
          reason_destination: data.reason_destination || "",
          aut_destination: data.aut_destination || "",
          responsible: data.responsible || "",
        });

  
        setHasInitializedDefaults(true);
      } catch (error) {
        console.error("Error al obtener registro para edición:", error);
      }
    };
  
    fetchData();
  }, [id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Editando
        await axiosInstance.put(`/waste/${id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        // Creando nuevo registro
        await axiosInstance.post("/waste", formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }

      alert("Registro enviado con éxito");
      setFormData({
        entry_date: null,
        exit_date: null,
        type: "",
        amount: "",
        container: "",
        area: "",
        art71: "",
        reason_art71: "",
        aut_semarnat: "",
        aut_SCT: "",
        reason_destination: "",
        aut_destination: "",
        chemicals: [],
        responsible: "",
      });
      setHasInitializedDefaults(false);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };


  return (
    <div className="waste-registry-screen">
      <Navbar />
      <div className="waste-registry-container">
        <h2>Bitácora de Residuos Peligrosos</h2>

        <form className="waste-registry-form" onSubmit={handleSubmit}>
          <div>
            <label>Fecha de ingreso:</label>
            <input
              type="date"
              name="entry_date"
              value={formatDate(formData.entry_date)}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Tipo de residuo:</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="">Seleccione tipo de residuo</option>
              {type.map((res, i) => (
                <option key={i} value={res}>
                  {res}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Cantidad (toneladas):</label>
            <input
              type="number" min={1}
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Tipo de contenedor:</label>
            <select
              name="container"
              value={formData.container}
              onChange={handleChange}
            >
              <option value="">Seleccione tipo de contenedor</option>
              {contenedores.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Área generadora:</label>
            <select name="area" value={formData.area} onChange={handleChange}>
              <option value="">Seleccione área</option>
              {areas.map((a, i) => (
                <option key={i} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Artículo 71:</label>
            <select name="art71" value={formData.art71} onChange={handleChange}>
              <option value="">Seleccione opción</option>
              {art17.map((a, i) => (
                <option key={i} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Razón social (artículo 71):</label>
            <select
              name="reason_art71"
              value={formData.reason_art71}
              onChange={handleChange}
            >
              <option value="">Seleccione razón social</option>
              {reason_art71.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Autorización SEMARNAT:</label>
            <select
              name="aut_semarnat"
              value={formData.aut_semarnat}
              onChange={handleChange}
            >
              <option value="">Seleccione autorización</option>
              {aut_semarnat.map((a, i) => (
                <option key={i} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Autorización SCT:</label>
            <select
              name="aut_SCT"
              value={formData.aut_SCT}
              onChange={handleChange}
            >
              <option value="">Seleccione autorización</option>
              {aut_SCT.map((s, i) => (
                <option key={i} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Destino del residuo:</label>
            <select
              name="reason_destination"
              value={formData.reason_destination}
              onChange={handleChange}
            >
              <option value="">Seleccione destino</option>
              {reason_destination.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Autorización del destino:</label>
            <select
              name="aut_destination"
              value={formData.aut_destination}
              onChange={handleChange}
            >
              <option value="">Seleccione autorización</option>
              {aut_destination.map((a, i) => (
                <option key={i} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>CRETI:</label>
              <div className="checkbox-group">
                {chemicals.map((q, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      name="chemicals"
                      value={q}
                      checked={formData.chemicals.includes(q)}
                      onChange={handleChange}
                    />
                    {q}
                  </label>
                ))}
              </div>
          </div>
          <div>
            <label>Responsable:</label>
            <select
              name="responsible"
              value={formData.responsible}
              onChange={handleChange}
            >
              <option value="">Seleccione responsable</option>
              {responsible.map((r, i) => (
                <option key={i} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="logwaste-submit-btn">
            Enviar Registro Para Revisión
          </button>
        </form>
      </div>
    </div>
  );
}
