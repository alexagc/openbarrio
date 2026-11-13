-- Cloudflare D1 Batch Insert Chunk for civic_facilities
CREATE INDEX IF NOT EXISTS idx_facilities_coords ON civic_facilities(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_facilities_type ON civic_facilities(type);

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_hosp_lapaz', 'healthcare', 'hospital', 'Hospital Universitario La Paz', 40.4805, -3.6872, '28079', '28046');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_hosp_gregorio', 'healthcare', 'hospital', 'Hospital General Universitario Gregorio Marañón', 40.4192, -3.6714, '28079', '28007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_hosp_clinico', 'healthcare', 'hospital', 'Hospital Clínico San Carlos', 40.4402, -3.7198, '28079', '28040');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_hosp_12octubre', 'healthcare', 'hospital', 'Hospital Universitario 12 de Octubre', 40.378, -3.698, '28079', '28041');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_pc_justicia', 'healthcare', 'primary_care', 'Centro de Salud Justicia', 40.4245, -3.6975, '28079', '28004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_pc_palma', 'healthcare', 'primary_care', 'Centro de Salud Palma - Universidad', 40.4278, -3.7062, '28079', '28015');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_pc_cortes', 'healthcare', 'primary_care', 'Centro de Salud Alameda - Cortes', 40.4125, -3.6935, '28079', '28014');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_pc_lagasca', 'healthcare', 'primary_care', 'Centro de Salud Lagasca', 40.4282, -3.685, '28079', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_sch_isabelcatolica', 'education', 'school', 'CEIP Isabel la Católica', 40.4276, -3.7001, '28079', '28004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_sch_rufino', 'education', 'school', 'CEIP Rufino Blanco', 40.4348, -3.7012, '28079', '28010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_sch_piomargall', 'education', 'school', 'CEIP Pi i Margall', 40.4225, -3.7038, '28079', '28004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_hs_sanisidro', 'education', 'high_school', 'IES San Isidro', 40.4128, -3.7075, '28079', '28005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_hs_cervantes', 'education', 'high_school', 'IES Cervantes', 40.4072, -3.7025, '28079', '28012');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_hs_lopedevega', 'education', 'high_school', 'IES Lope de Vega', 40.4284, -3.7067, '28079', '28015');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_sol', 'transit', 'metro', 'Metro / Cercanías Sol', 40.4169, -3.7035, '28079', '28013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_granvia', 'transit', 'metro', 'Metro Gran Vía', 40.4201, -3.7016, '28079', '28013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_callao', 'transit', 'metro', 'Metro Callao', 40.42, -3.7056, '28079', '28013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_atocha', 'transit', 'train', 'Estación de Atocha Renfe / Cercanías', 40.4065, -3.6908, '28079', '28012');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_chamartin', 'transit', 'train', 'Estación Madrid-Chamartín Clara Campoamor', 40.472, -3.6825, '28079', '28036');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_nuevosmin', 'transit', 'metro', 'Estación Nuevos Ministerios', 40.4462, -3.6918, '28079', '28046');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_moncloa', 'transit', 'bus_hub', 'Intercambiador de Moncloa', 40.4352, -3.7188, '28079', '28008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_avamerica', 'transit', 'bus_hub', 'Intercambiador Avenida de América', 40.4385, -3.6762, '28079', '28002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_prk_retiro', 'park', 'urban_park', 'Parque del Buen Retiro', 40.4153, -3.6845, '28079', '28009');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_prk_rio', 'park', 'urban_park', 'Madrid Río', 40.4015, -3.7125, '28079', '28005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_prk_oeste', 'park', 'urban_park', 'Parque del Oeste', 40.4315, -3.7245, '28079', '28008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_prk_casadecampo', 'park', 'metropolitan_park', 'Casa de Campo', 40.4215, -3.755, '28079', '28011');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_prk_dehesavilla', 'park', 'metropolitan_park', 'Dehesa de la Villa', 40.458, -3.7225, '28079', '28039');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_hosp_clinic', 'healthcare', 'hospital', 'Hospital Clínic de Barcelona', 41.3892, 2.1523, '08019', '08036');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_hosp_vallhebron', 'healthcare', 'hospital', 'Hospital Universitari Vall d''Hebron', 41.428, 2.1435, '08019', '08035');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_hosp_santpau', 'healthcare', 'hospital', 'Hospital de la Santa Creu i Sant Pau', 41.4125, 2.1745, '08019', '08025');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_hosp_delmar', 'healthcare', 'hospital', 'Hospital del Mar', 41.3838, 2.1932, '08019', '08003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_pc_gotic', 'healthcare', 'primary_care', 'CAP Gòtic', 41.3812, 2.1775, '08019', '08002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_pc_ravalnord', 'healthcare', 'primary_care', 'CAP Raval Nord', 41.3835, 2.1678, '08019', '08001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_pc_casp', 'healthcare', 'primary_care', 'CAP Casp - Eixample Dret', 41.3932, 2.1695, '08019', '08010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_pc_sarria', 'healthcare', 'primary_care', 'CAP Sarrià', 41.3995, 2.1225, '08019', '08017');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_sch_ciutadella', 'education', 'school', 'CEIP Parc de la Ciutadella', 41.3872, 2.1852, '08019', '08003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_sch_concepcio', 'education', 'school', 'Escola Concepció', 41.3965, 2.1654, '08019', '08009');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_sch_perevila', 'education', 'school', 'Escola Pere Vila', 41.3915, 2.1802, '08019', '08018');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_hs_jaumebalmes', 'education', 'high_school', 'Institut Jaume Balmes', 41.3934, 2.1668, '08019', '08008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_hs_milafontanals', 'education', 'high_school', 'Institut Milà i Fontanals', 41.3805, 2.1692, '08019', '08001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_hs_maragall', 'education', 'high_school', 'Institut Maragall', 41.3925, 2.1512, '08019', '08036');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_tra_plcatalunya', 'transit', 'metro', 'Estació Plaça de Catalunya (Metro / Rodalies)', 41.387, 2.17, '08019', '08002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_tra_pgracia', 'transit', 'metro', 'Metro Passeig de Gràcia', 41.3922, 2.1663, '08019', '08007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_tra_diagonal', 'transit', 'metro', 'Metro Diagonal', 41.3975, 2.1585, '08019', '08008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_tra_sants', 'transit', 'train', 'Estació de Barcelona-Sants', 41.3792, 2.1402, '08019', '08014');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_tra_sagrera', 'transit', 'train', 'Estació de La Sagrera - Meridiana', 41.4225, 2.1895, '08019', '08027');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_tra_nord', 'transit', 'bus_hub', 'Estació d''Autobusos Barcelona Nord', 41.3945, 2.1825, '08019', '08013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_prk_ciutadella', 'park', 'urban_park', 'Parc de la Ciutadella', 41.388, 2.1874, '08019', '08003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_prk_guell', 'park', 'urban_park', 'Park Güell', 41.4145, 2.1528, '08019', '08024');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_prk_montjuic', 'park', 'metropolitan_park', 'Parc de Montjuïc', 41.3665, 2.1575, '08019', '08038');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bcn_prk_collserola', 'park', 'metropolitan_park', 'Parc Natural de Collserola', 41.425, 2.115, '08019', '08017');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_hosp_lafe', 'healthcare', 'hospital', 'Hospital Universitari i Politècnic La Fe', 39.4445, -0.3775, '46250', '46026');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_hosp_clinic', 'healthcare', 'hospital', 'Hospital Clínic Universitari de València', 39.4795, -0.3582, '46250', '46010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_hosp_general', 'healthcare', 'hospital', 'Hospital General Universitari de València', 39.4675, -0.4042, '46250', '46014');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_pc_salvadorpau', 'healthcare', 'primary_care', 'Centre de Salut Salvador Pau', 39.4682, -0.354, '46250', '46021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_pc_guillemcastro', 'healthcare', 'primary_care', 'Centre de Salut Guillem de Castro', 39.4715, -0.3835, '46250', '46001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_pc_ruzafa', 'healthcare', 'primary_care', 'Centre de Salut Russafa', 39.4615, -0.3725, '46250', '46006');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_sch_cervantes', 'education', 'school', 'CEIP Cervantes', 39.4745, -0.3842, '46250', '46008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_sch_teodoro', 'education', 'school', 'CEIP Teodoro Llorente', 39.472, -0.392, '46250', '46008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_hs_lluisvives', 'education', 'high_school', 'IES Lluís Vives', 39.4678, -0.3775, '46250', '46004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_hs_santvicent', 'education', 'high_school', 'IES Sant Vicent Ferrer', 39.4742, -0.3695, '46250', '46003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_tra_xativa', 'transit', 'metro', 'Metro Xàtiva', 39.4667, -0.3772, '46250', '46007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_tra_colon', 'transit', 'metro', 'Metro Colón', 39.4694, -0.3712, '46250', '46004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_tra_nord', 'transit', 'train', 'Estació del Nord Renfe', 39.4662, -0.3776, '46250', '46007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_tra_joaquinsorolla', 'transit', 'train', 'Estació Joaquín Sorolla (AVE)', 39.4585, -0.3802, '46250', '46007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_tra_autobusos', 'transit', 'bus_hub', 'Estació d''Autobusos de València', 39.4815, -0.3875, '46250', '46009');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_prk_turia', 'park', 'urban_park', 'Jardí del Túria', 39.4785, -0.3685, '46250', '46003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_prk_viveros', 'park', 'urban_park', 'Jardins del Real (Viveros)', 39.4805, -0.3665, '46250', '46010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vlc_prk_cabecera', 'park', 'metropolitan_park', 'Parc de Capçalera', 39.4755, -0.4095, '46250', '46015');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_hosp_rocio', 'healthcare', 'hospital', 'Hospital Universitario Virgen del Rocío', 37.3592, -5.9785, '41091', '41013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_hosp_macarena', 'healthcare', 'hospital', 'Hospital Universitario Virgen Macarena', 37.4085, -5.9865, '41091', '41009');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_pc_alameda', 'healthcare', 'primary_care', 'Centro de Salud Alameda - San Luis', 37.3995, -5.9925, '41091', '41003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_pc_marquesparadas', 'healthcare', 'primary_care', 'Centro de Salud Marqués de Paradas', 37.391, -6.0012, '41091', '41001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_pc_triana', 'healthcare', 'primary_care', 'Centro de Salud Triana', 37.382, -6.0065, '41091', '41010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_sch_sorangela', 'education', 'school', 'CEIP Sor Ángela de la Cruz', 37.398, -5.9905, '41091', '41003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_sch_altoscolegios', 'education', 'school', 'CEIP Altos Colegios Macarena', 37.4045, -5.9885, '41091', '41009');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_hs_sanisidoro', 'education', 'high_school', 'IES San Isidoro', 37.3955, -5.994, '41091', '41004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_hs_becquer', 'education', 'high_school', 'IES Gustavo Adolfo Bécquer', 37.3815, -6.0085, '41091', '41010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_tra_santajusta', 'transit', 'train', 'Estación Sevilla-Santa Justa Renfe', 37.3922, -5.9754, '41091', '41007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_tra_puertajerez', 'transit', 'metro', 'Metro Puerta de Jerez', 37.3828, -5.993, '41091', '41001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_tra_plazanueva', 'transit', 'metro', 'MetroCentro Plaza Nueva', 37.3888, -5.9954, '41091', '41001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_tra_plazadearmas', 'transit', 'bus_hub', 'Estación de Autobuses Plaza de Armas', 37.3915, -6.0045, '41091', '41001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_prk_marialuisa', 'park', 'urban_park', 'Parque de María Luisa', 37.3752, -5.9875, '41091', '41013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_prk_murillo', 'park', 'urban_park', 'Jardines de Murillo', 37.3845, -5.986, '41091', '41004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sev_prk_alamillo', 'park', 'metropolitan_park', 'Parque del Alamillo', 37.4195, -5.9965, '41091', '41092');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_zgz_hosp_servet', 'healthcare', 'hospital', 'Hospital Universitario Miguel Servet', 41.6355, -0.9002, '50297', '50009');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_zgz_pc_sanpablo', 'healthcare', 'primary_care', 'Centro de Salud San Pablo', 41.6558, -0.8872, '50297', '50003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_zgz_sch_costa', 'education', 'school', 'CEIP Joaquín Costa', 41.6492, -0.8845, '50297', '50001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_zgz_hs_goya', 'education', 'high_school', 'IES Goya', 41.6468, -0.8895, '50297', '50006');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_zgz_tra_delicias', 'transit', 'train', 'Estación de Zaragoza-Delicias', 41.6585, -0.9115, '50297', '50011');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_zgz_tra_plzaespana', 'transit', 'metro', 'Tranvía Plaza España', 41.6515, -0.8812, '50297', '50001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_zgz_prk_labordeta', 'park', 'urban_park', 'Parque Grande José Antonio Labordeta', 41.6322, -0.8955, '50297', '50006');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_zgz_prk_agua', 'park', 'metropolitan_park', 'Parque del Agua Luis Buñuel', 41.6705, -0.9085, '50297', '50018');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_agp_hosp_regional', 'healthcare', 'hospital', 'Hospital Regional Universitario de Málaga', 36.7215, -4.4372, '29067', '29010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_agp_pc_jesuscautivo', 'healthcare', 'primary_care', 'Centro de Salud Jesús Cautivo', 36.723, -4.4285, '29067', '29007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_agp_sch_practicas', 'education', 'school', 'CEIP Prácticas Nº 1', 36.721, -4.4205, '29067', '29013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_agp_hs_vicenteespinel', 'education', 'high_school', 'IES Vicente Espinel (Gaona)', 36.7252, -4.423, '29067', '29013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_agp_tra_mariazambrano', 'transit', 'train', 'Estación María Zambrano Renfe', 36.7118, -4.432, '29067', '29002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_agp_tra_atarazanas', 'transit', 'metro', 'Metro Atarazanas', 36.7172, -4.4245, '29067', '29005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_agp_prk_parquemalaga', 'park', 'urban_park', 'Parque de Málaga', 36.7195, -4.415, '29067', '29015');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_agp_prk_gibralfaro', 'park', 'metropolitan_park', 'Parque de Gibralfaro', 36.7235, -4.411, '29067', '29016');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bio_hosp_basurto', 'healthcare', 'hospital', 'Hospital Universitario Basurto', 43.2605, -2.9525, '48020', '48013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bio_pc_cascoviejo', 'healthcare', 'primary_care', 'Centro de Salud Casco Viejo', 43.2575, -2.9235, '48020', '48005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bio_sch_cervantes', 'education', 'school', 'CEIP Cervantes', 43.2635, -2.9345, '48020', '48009');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bio_hs_unamuno', 'education', 'high_school', 'IES Miguel de Unamuno', 43.2642, -2.9405, '48020', '48010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bio_tra_abando', 'transit', 'train', 'Estación Bilbao-Abando Indalecio Prieto', 43.2608, -2.9275, '48020', '48001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bio_tra_cascoviejo', 'transit', 'metro', 'Metro Casco Viejo - Zazpikaleak', 43.2588, -2.9222, '48020', '48005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bio_prk_casilda', 'park', 'urban_park', 'Parque de Doña Casilda Iturrizar', 43.2665, -2.9412, '48020', '48009');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_bio_prk_etxebarria', 'park', 'urban_park', 'Parque Etxebarria', 43.2605, -2.9195, '48020', '48005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_alc_hosp_general', 'healthcare', 'hospital', 'Hospital General Universitario Dr. Balmis', 38.3585, -0.4892, '03014', '03010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_alc_pc_sanfernando', 'healthcare', 'primary_care', 'Centro de Salud San Fernando', 38.3475, -0.4905, '03014', '03005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_alc_sch_campoamor', 'education', 'school', 'CEIP Campoamor', 38.3522, -0.488, '03014', '03004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_alc_hs_jorgejuan', 'education', 'high_school', 'IES Jorge Juan', 38.3495, -0.4912, '03014', '03005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_alc_tra_terminal', 'transit', 'train', 'Estación de Alicante-Terminal Renfe', 38.3435, -0.495, '03014', '03003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_alc_tra_luceros', 'transit', 'metro', 'TRAM Estación Luceros', 38.3458, -0.4915, '03014', '03003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_alc_prk_canalejas', 'park', 'urban_park', 'Parque de Canalejas', 38.3418, -0.4875, '03014', '03001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_alc_prk_palmeral', 'park', 'metropolitan_park', 'Parque El Palmeral', 38.3245, -0.514, '03014', '03008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_odb_hosp_reinasofia', 'healthcare', 'hospital', 'Hospital Universitario Reina Sofía', 37.8672, -4.7925, '14021', '14004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_odb_pc_centro', 'healthcare', 'primary_care', 'Centro de Salud Córdoba Centro', 37.8865, -4.7812, '14021', '14001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_odb_sch_colon', 'education', 'school', 'CEIP Colón', 37.889, -4.7795, '14021', '14001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_odb_hs_gongora', 'education', 'high_school', 'IES Luis de Góngora', 37.8852, -4.783, '14021', '14003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_odb_tra_central', 'transit', 'train', 'Estación Central de Córdoba Renfe', 37.8885, -4.7895, '14021', '14011');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_odb_prk_victoria', 'park', 'urban_park', 'Jardines de la Victoria', 37.8845, -4.7865, '14021', '14008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vll_hosp_clinico', 'healthcare', 'hospital', 'Hospital Clínico Universitario de Valladolid', 41.6565, -4.7185, '47186', '47005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vll_pc_ejercito', 'healthcare', 'primary_care', 'Centro de Salud Plaza del Ejército', 41.6425, -4.7295, '47186', '47007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vll_sch_sanfernando', 'education', 'school', 'CEIP San Fernando', 41.648, -4.7315, '47186', '47006');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vll_hs_zorrilla', 'education', 'high_school', 'IES Zorrilla', 41.6535, -4.729, '47186', '47006');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vll_tra_campogrande', 'transit', 'train', 'Estación Valladolid-Campo Grande Renfe', 41.6422, -4.729, '47186', '47007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vll_prk_campogrande', 'park', 'urban_park', 'Parque del Campo Grande', 41.6455, -4.7285, '47186', '47007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vgo_hosp_alvarocunqueiro', 'healthcare', 'hospital', 'Hospital Álvaro Cunqueiro', 42.195, -8.736, '36057', '36312');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vgo_pc_rosalia', 'healthcare', 'primary_care', 'Centro de Salud Rosalía de Castro', 42.2355, -8.7212, '36057', '36201');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vgo_sch_garciabarbon', 'education', 'school', 'CEIP García Barbón', 42.2385, -8.7155, '36057', '36201');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vgo_hs_santairene', 'education', 'high_school', 'IES Santa Irene', 42.2285, -8.7302, '36057', '36211');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vgo_tra_urzaiz', 'transit', 'train', 'Estación Vigo-Urzáiz Renfe', 42.2345, -8.7145, '36057', '36201');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vgo_prk_castro', 'park', 'urban_park', 'Parque do Castro', 42.232, -8.7265, '36057', '36203');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_gij_hosp_cabuenes', 'healthcare', 'hospital', 'Hospital Universitario de Cabueñes', 43.5245, -5.6185, '33024', '33394');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_gij_pc_puertavilla', 'healthcare', 'primary_care', 'Centro de Salud Puerta de la Villa', 43.5385, -5.6635, '33024', '33206');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_gij_sch_jovellanos', 'education', 'school', 'CEIP Jovellanos', 43.5395, -5.6605, '33024', '33205');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_gij_hs_jovellanos', 'education', 'high_school', 'IES Real Instituto de Jovellanos', 43.5352, -5.658, '33024', '33201');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_gij_tra_sanzcrespo', 'transit', 'train', 'Estación Gijón Sanz Crespo Renfe', 43.5372, -5.673, '33024', '33207');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_gij_prk_isabelcatolica', 'park', 'urban_park', 'Parque de Isabel la Católica', 43.5365, -5.6425, '33024', '33203');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pmi_hosp_sonespases', 'healthcare', 'hospital', 'Hospital Universitari Son Espases', 39.6085, 2.6455, '07040', '07120');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pmi_pc_emilidarder', 'healthcare', 'primary_care', 'Centre de Salut Emili Darder', 39.5825, 2.6515, '07040', '07004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pmi_sch_jaumei', 'education', 'school', 'CEIP Jaume I', 39.578, 2.6565, '07040', '07005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pmi_hs_ramonllull', 'education', 'high_school', 'IES Ramon Llull', 39.5752, 2.653, '07040', '07003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pmi_tra_intermodal', 'transit', 'train', 'Estació Intermodal Plaça d''Espanya', 39.5755, 2.654, '07040', '07002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pmi_prk_estacions', 'park', 'urban_park', 'Parc de les Estacions', 39.5765, 2.6555, '07040', '07002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pmi_prk_mar', 'park', 'urban_park', 'Parc de la Mar', 39.5665, 2.648, '07040', '07001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lpa_hosp_drnegrin', 'healthcare', 'hospital', 'Hospital Universitario de Gran Canaria Doctor Negrín', 28.1255, -15.4485, '35016', '35010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lpa_pc_triana', 'healthcare', 'primary_care', 'Centro de Salud Triana', 28.1065, -15.4175, '35016', '35002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lpa_sch_iberia', 'education', 'school', 'CEIP Iberia', 28.1095, -15.419, '35016', '35003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lpa_hs_perezgaldos', 'education', 'high_school', 'IES Pérez Galdós', 28.1085, -15.4215, '35016', '35003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lpa_tra_santelmo', 'transit', 'bus_hub', 'Estación de Guaguas San Telmo', 28.108, -15.415, '35016', '35002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lpa_prk_doramas', 'park', 'urban_park', 'Parque Doramas', 28.1215, -15.4255, '35016', '35005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_tfn_hosp_candelaria', 'healthcare', 'hospital', 'Hospital Universitario Nuestra Señora de Candelaria', 28.4485, -16.2915, '38038', '38010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_tfn_pc_weyler', 'healthcare', 'primary_care', 'Centro de Salud Weyler', 28.4682, -16.2555, '38038', '38003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_tfn_sch_isabelcatolica', 'education', 'school', 'CEIP Isabel la Católica', 28.4665, -16.252, '38038', '38003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_tfn_hs_andresbello', 'education', 'high_school', 'IES Andrés Bello', 28.4615, -16.2625, '38038', '38007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_tfn_tra_intercambiador', 'transit', 'bus_hub', 'Intercambiador de Santa Cruz de Tenerife (Tranvía / TITSA)', 28.4575, -16.256, '38038', '38003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_tfn_prk_garciasanabria', 'park', 'urban_park', 'Parque García Sanabria', 28.4725, -16.2535, '38038', '38004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mur_hosp_reinasofia', 'healthcare', 'hospital', 'Hospital General Universitario Reina Sofía', 37.9825, -1.1245, '30030', '30003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mur_pc_sanandres', 'healthcare', 'primary_care', 'Centro de Salud San Andrés', 37.9855, -1.1365, '30030', '30005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mur_sch_cierva', 'education', 'school', 'CEIP Cierva Peñafiel', 37.986, -1.129, '30030', '30001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mur_hs_cascales', 'education', 'high_school', 'IES Licenciado Francisco Cascales', 37.984, -1.1275, '30030', '30001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mur_tra_carmen', 'transit', 'train', 'Estación de Murcia del Carmen Renfe', 37.9745, -1.131, '30030', '30002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mur_prk_floridablanca', 'park', 'urban_park', 'Jardín de Floridablanca', 37.9795, -1.1305, '30030', '30002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_grx_hosp_virgennieves', 'healthcare', 'hospital', 'Hospital Universitario Virgen de las Nieves', 37.1915, -3.611, '18087', '18014');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_grx_pc_grancapitan', 'healthcare', 'primary_care', 'Centro de Salud Gran Capitán', 37.1795, -3.6055, '18087', '18002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_grx_sch_gomezmoreno', 'education', 'school', 'CEIP Gómez Moreno', 37.182, -3.5935, '18087', '18010');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_grx_hs_padremanjon', 'education', 'high_school', 'IES Padre Manjón', 37.1865, -3.604, '18087', '18012');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_grx_tra_ferrocarril', 'transit', 'train', 'Estación de Ferrocarril de Granada (Renfe / Metro)', 37.1845, -3.6095, '18087', '18014');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_grx_prk_garcialorca', 'park', 'urban_park', 'Parque Federico García Lorca', 37.1685, -3.6105, '18087', '18004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_eas_hosp_donostia', 'healthcare', 'hospital', 'Hospital Universitario Donostia', 43.2985, -1.9745, '20069', '20014');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_eas_pc_partevieja', 'healthcare', 'primary_care', 'Centro de Salud Parte Vieja', 43.3235, -1.9845, '20069', '20003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_eas_sch_amaraberri', 'education', 'school', 'CEIP Amara Berri', 43.3075, -1.9785, '20069', '20011');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_eas_hs_usandizaga', 'education', 'high_school', 'IES Usandizaga-Peñaflorida-Amara', 43.314, -1.9785, '20069', '20011');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_eas_tra_donostia', 'transit', 'train', 'Estación Donostia-San Sebastián Renfe', 43.3175, -1.9775, '20069', '20012');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_eas_prk_cristinaenea', 'park', 'urban_park', 'Parque de Cristina Enea', 43.3155, -1.9745, '20069', '20012');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lcg_hosp_chuac', 'healthcare', 'hospital', 'Complexo Hospitalario Universitario da Coruña (CHUAC)', 43.3445, -8.3965, '15030', '15006');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lcg_pc_sanjose', 'healthcare', 'primary_care', 'Centro de Saúde San José', 43.3715, -8.4025, '15030', '15001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lcg_sch_emiliapardo', 'education', 'school', 'CEIP Emilia Pardo Bazán', 43.3615, -8.411, '15030', '15004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lcg_hs_eusebioguarda', 'education', 'high_school', 'IES Eusebio da Guarda', 43.3685, -8.4065, '15030', '15004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lcg_tra_sancristobal', 'transit', 'train', 'Estación A Coruña San Cristóbal Renfe', 43.3525, -8.4095, '15030', '15007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_lcg_prk_mendeznunez', 'park', 'urban_park', 'Xardíns de Méndez Núñez', 43.3685, -8.4035, '15030', '15003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sdr_hosp_valdecilla', 'healthcare', 'hospital', 'Hospital Universitario Marqués de Valdecilla', 43.4555, -3.8325, '39075', '39008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sdr_pc_centro', 'healthcare', 'primary_care', 'Centro de Salud Santander Centro', 43.4625, -3.8115, '39075', '39001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sdr_sch_dionisio', 'education', 'school', 'CEIP Dionisio García Barredo', 43.4605, -3.8235, '39075', '39007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sdr_hs_santaclara', 'education', 'high_school', 'IES Santa Clara', 43.4655, -3.8125, '39075', '39001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sdr_tra_terminal', 'transit', 'train', 'Estación de Santander Renfe / Adif', 43.4595, -3.813, '39075', '39002');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_sdr_prk_magdalena', 'park', 'urban_park', 'Parque de la Península de la Magdalena', 43.4695, -3.7665, '39075', '39005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pna_hosp_hun', 'healthcare', 'hospital', 'Hospital Universitario de Navarra (HUN)', 42.8075, -1.6665, '31201', '31008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pna_pc_cascoviejo', 'healthcare', 'primary_care', 'Centro de Salud Casco Viejo', 42.8185, -1.6445, '31201', '31001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pna_sch_sanfrancisco', 'education', 'school', 'CEIP San Francisco', 42.819, -1.6465, '31201', '31001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pna_hs_plazadelacruz', 'education', 'high_school', 'IES Plaza de la Cruz', 42.8125, -1.6425, '31201', '31004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pna_tra_estacion', 'transit', 'train', 'Estación de Ferrocarril de Pamplona Renfe', 42.8275, -1.6615, '31201', '31012');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_pna_prk_ciudadela', 'park', 'urban_park', 'Parque de la Ciudadela', 42.8125, -1.6505, '31201', '31007');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vit_hosp_txagorritxu', 'healthcare', 'hospital', 'Hospital Universitario de Araba (HUA Txagorritxu)', 42.8565, -2.6885, '01059', '01009');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vit_pc_olaguibel', 'healthcare', 'primary_care', 'Centro de Salud Olaguíbel', 42.8465, -2.6685, '01059', '01004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vit_sch_ramonbajo', 'education', 'school', 'CEIP Ramón Bajo', 42.8495, -2.671, '01059', '01001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vit_hs_federicobaraibar', 'education', 'high_school', 'IES Federico Baraibar', 42.8445, -2.6625, '01059', '01003');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vit_tra_renfe', 'transit', 'train', 'Estación de Vitoria-Gasteiz Renfe', 42.8415, -2.673, '01059', '01005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vit_tra_angulema', 'transit', 'metro', 'Tranvía de Vitoria Parada Angulema', 42.8445, -2.6695, '01059', '01004');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vit_prk_florida', 'park', 'urban_park', 'Parque de La Florida', 42.8445, -2.6755, '01059', '01005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_vit_prk_salburua', 'park', 'metropolitan_park', 'Parque de Salburua (Anillo Verde)', 42.8545, -2.6455, '01059', '01013');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_cercanias_orcasitas', 'transit', 'train', 'Estación Cercanías Orcasitas (C-5)', 40.3685, -3.7125, '28079', '28041');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_cercanias_mendezalvaro', 'transit', 'train', 'Estación Méndez Álvaro (Cercanías C-1, C-5, C-10 / Metro L6)', 40.3952, -3.6785, '28079', '28045');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_cercanias_piramides', 'transit', 'train', 'Estación Pirámides (Cercanías C-1, C-10 / Metro L5)', 40.4025, -3.7125, '28079', '28005');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('fac_mad_tra_cercanias_principrepio', 'transit', 'train', 'Intercambiador Príncipe Pío (Cercanías C-1, C-7, C-10 / Metro L6, L10)', 40.4208, -3.7195, '28079', '28008');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439699466', 'transit', 'bus', 'Parada EMT Puente Alcocer', 40.3498393, -3.705402, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439699467', 'transit', 'bus', 'Parada EMT Puente Alcocer', 40.3502146, -3.7053433, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439699470', 'transit', 'bus', 'Parada EMT Alcocer-Paseo Talleres', 40.3497693, -3.701045, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439700456', 'transit', 'bus', 'Parada EMT Astillero', 40.3426803, -3.7141614, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439700460', 'transit', 'bus', 'Parada EMT Astillero', 40.3431845, -3.7140547, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439703719', 'transit', 'bus', 'Parada EMT Puente Alcocer', 40.3500939, -3.7062059, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439703734', 'transit', 'bus', 'Parada EMT Puente Alcocer', 40.3502067, -3.7060807, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704237', 'transit', 'bus', 'Parada EMT Villaverde Alto Cercanías', 40.3419445, -3.7125936, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704238', 'transit', 'bus', 'Parada EMT Villaverde Alto Cercanías', 40.3420888, -3.7126907, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704239', 'transit', 'bus', 'Parada EMT Domingo Párraga-Real de Pinto', 40.3419956, -3.7079283, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704240', 'transit', 'bus', 'Parada EMT Domingo Párraga-Real de Pinto', 40.3419892, -3.70852, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704243', 'transit', 'bus', 'Parada EMT Domingo Párraga-Astillero', 40.3420523, -3.7148412, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704244', 'transit', 'bus', 'Parada EMT Domingo Párraga-Astillero', 40.3422027, -3.7148715, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704337', 'transit', 'bus', 'Parada EMT Doctor Martín Arévalo', 40.3460904, -3.7064437, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704338', 'transit', 'bus', 'Parada EMT Villaverde Alto', 40.3461896, -3.7081653, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704340', 'transit', 'bus', 'Parada EMT Doctor Pérez Domínguez', 40.346963, -3.7068793, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439704520', 'transit', 'bus', 'Parada EMT Villaverde Alto', 40.3416578, -3.7125434, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439709471', 'transit', 'bus', 'Parada EMT Plaza de Ágata', 40.3464651, -3.7085264, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439709473', 'transit', 'bus', 'Parada EMT Villaverde Alto', 40.3466619, -3.7087457, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439710131', 'transit', 'bus', 'Parada EMT Alberto Palacios-Aladierna', 40.3460644, -3.7114147, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439710133', 'transit', 'bus', 'Parada EMT Alberto Palacios-Aladierna', 40.3462599, -3.71112, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439710137', 'transit', 'bus', 'Parada EMT Alberto Palacios-Juan Peñalver', 40.3443759, -3.7133562, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439710142', 'transit', 'bus', 'Parada EMT Alberto Palacios-Juan Peñalver', 40.3444401, -3.7131232, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439710144', 'transit', 'bus', 'Parada EMT Plaza del Ágata', 40.346504, -3.7095212, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439711803', 'transit', 'bus', 'Parada EMT Valle de Tobalina-Ciudad de Frías', 40.3408717, -3.7141717, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439712048', 'transit', 'bus', 'Parada EMT Junta Municipal Villaverde', 40.3492952, -3.709773, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439712051', 'transit', 'bus', 'Parada EMT Villalonso-Puebla de Sanabria', 40.3491089, -3.7129764, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439712052', 'transit', 'bus', 'Parada EMT Villalonso-Puebla de Sanabria', 40.349341, -3.7126795, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1439712054', 'transit', 'bus', 'Parada EMT Junta Municipal Villaverde', 40.3494976, -3.7098304, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3293472379', 'transit', 'bus', 'Parada EMT Av. Real de Pinto - Col. Butano', 40.3431121, -3.7072442, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6484184852', 'transit', 'metro', 'Acceso Metro Valle de Tobalina', 40.3410027, -3.7127338, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_12250228719', 'transit', 'bus', 'Parada EMT Av. Real de Pinto - Col. Butano', 40.3431166, -3.7071563, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_12251128619', 'transit', 'bus', 'Parada EMT Av. Real de Pinto - INEM', 40.3458088, -3.7063894, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_12251128620', 'transit', 'bus', 'Parada EMT Av. Real de Pinto - INEM', 40.3459706, -3.7061436, '28079', '28021');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_25903356', 'transit', 'metro', 'Retiro', 40.4204766, -3.6864209, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_79715911', 'transit', 'train', 'Estación Fuencarral', 40.5015362, -3.6821615, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_98745210', 'healthcare', 'primary_care', 'Centro de Especialidades José Marvá', 40.4634507, -3.6967219, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_151223420', 'education', 'school', 'Guardería Sancalo', 40.4851211, -3.6897765, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_162497349', 'healthcare', 'primary_care', 'Centro de Salud Virgen Begoña', 40.4841061, -3.6852867, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_254920246', 'healthcare', 'primary_care', 'Centro de Salud de Barajas', 40.4716064, -3.5819254, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_259092311', 'transit', 'train', 'Estación El Casar', 40.3185283, -3.7096898, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266166997', 'education', 'school', 'Colegio de Educación Infantil y Primaria Daoiz y Velarde', 40.4876732, -3.3679283, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266166999', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Sagrado Corazón de Jesús', 40.481115, -3.3671165, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167000', 'education', 'school', 'Colegio San Francisco de Asís', 40.4838115, -3.365706, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167001', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria San Felipe Neri', 40.4814437, -3.3689423, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167004', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Santa María de la Providencia', 40.4883703, -3.3656126, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167010', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Minerva', 40.4849167, -3.3567703, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167035', 'education', 'school', 'Escuela Infantil Privada San Pedro Apóstol', 40.5411559, -3.632433, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167093', 'education', 'school', 'Centro Privado de Educación Primaria San Antonio', 40.5422921, -3.6289903, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167229', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Nuestra Señora de los Remedios', 40.3474338, -3.831339, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167233', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Centro Educativo Villa de Alcorcón', 40.3493537, -3.8275833, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167234', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Amor de Dios', 40.3511781, -3.8157124, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167242', 'education', 'school', 'Colegio de Educación Infantil y Primaria Santa Quiteria', 40.6550773, -4.0197572, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167266', 'education', 'high_school', 'Colegio de Educación Infantil, Primaria y Secundaria Eugenio Muro', 40.3028038, -4.4524277, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167267', 'education', 'high_school', 'Colegio de Educación Infantil, Primaria y Secundaria Federico García Lorca', 40.5456634, -3.3772995, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167276', 'education', 'high_school', 'Colegio de Educación Infantil, Primaria y Secundaria Peñalta', 40.991551, -3.6400508, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167281', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica San Juan de Dios', 40.1591906, -3.6107468, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167299', 'education', 'school', 'Colegio de Educación Infantil y Primaria Virgen de la Paz', 40.6944302, -4.0316134, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167305', 'education', 'school', 'Centro Privado de Educación Infantil Mamá Juanita', 40.4281167, -3.5697429, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167319', 'education', 'school', 'Colegio de Educación Infantil y Primaria San Pablo', 40.4276082, -3.5688136, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167345', 'education', 'school', 'Colegio de Educación Infantil y Primaria Miguel Delibes', 40.6264495, -4.0002955, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167354', 'education', 'school', 'Escuela Infantil Padre Gerardo Gil', 40.5840181, -4.1264162, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167357', 'education', 'high_school', 'Instituto de Educación Secundaria Miguel Catalán', 40.4321527, -3.5413486, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167359', 'education', 'school', 'Colegio de Educación Infantil y Primaria San Esteban', 40.437433, -3.5320487, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167362', 'education', 'school', 'Colegio de Educación Infantil y Primaria La Alhóndiga', 40.3068446, -3.7378674, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167367', 'education', 'school', 'Colegio de Educación Infantil y Primaria Alarilla', 40.1163444, -3.161196, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167368', 'education', 'high_school', 'Colegio de Educación Infantil, Primaria y Secundaria Martina García', 40.6295054, -3.515728, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167370', 'education', 'school', 'Colegio de Educación Infantil y Primaria Carlos Ruiz', 40.1832415, -3.1076777, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167371', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria San Sebastián', 40.3127455, -3.7263154, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167384', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria San José', 40.3078041, -3.730512, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167392', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria Mengual', 40.3081033, -3.7268783, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167403', 'education', 'school', 'Colegio de Educación Infantil y Primaria Hermanos Tora', 40.2497519, -3.83018, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167405', 'education', 'school', 'Colegio de Educación Infantil y Primaria Lepanto', 40.3357934, -3.7702634, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167410', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Divina Pastora', 40.3091005, -3.7330318, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167411', 'education', 'school', 'Colegio de Educación Infantil y Primaria San José de Calasanz', 40.310402, -3.7305365, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167421', 'education', 'high_school', 'Centro Privado de Educación Primaria y Secundaria Montfort International School', 40.3911777, -3.4203591, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167424', 'education', 'school', 'Colegio de Educación Infantil y Primaria Marqués de Leganés', 40.3249888, -3.7684858, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167443', 'education', 'school', 'Escuela Infantil Privada Cervantes Baby', 40.3842185, -3.7300339, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167459', 'education', 'school', 'Colegio de Educación Infantil y Primaria Bolivia', 40.4075213, -3.7501124, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167460', 'education', 'school', 'Colegio de Educación Infantil y Primaria Ciudad Pegaso', 40.4472065, -3.5981296, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167469', 'education', 'school', 'Colegio de Educación Especial María Soriano', 40.3628619, -3.7622051, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167485', 'education', 'school', 'Colegio de Educación Infantil y Primaria Méjico', 40.443436, -3.6508507, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167518', 'education', 'school', 'Colegio de Educación Infantil y Primaria San Eugenio y San Isidro', 40.4021177, -3.7031018, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167531', 'education', 'school', 'Colegio de Educación Infantil y Primaria Ramiro de Maeztu', 40.4423487, -3.6874627, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167536', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Madres Concepcionistas', 40.4262288, -3.7134168, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167537', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria San Luis-felca', 40.3827694, -3.7093833, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167560', 'education', 'school', 'Colegio de Educación Infantil y Primaria Arcipreste de Hita', 40.3849226, -3.7257724, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167561', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Alameda de Osuna', 40.455138, -3.5941147, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167562', 'education', 'school', 'Escuela Infantil Privada Eipa Escuela Infantil Parque de las Avenidas', 40.4391175, -3.6625525, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167563', 'education', 'school', 'Centro Privado de Educación Infantil Comendadoras de Santiago', 40.4274181, -3.7089933, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167565', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Beata Filipina-fund.feliciana Viertola', 40.3802565, -3.7726641, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167566', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria Liceo Oroquieta', 40.3549461, -3.6918802, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167569', 'education', 'school', 'Colegio Pablo VI', 40.4620328, -3.6987685, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167570', 'education', 'high_school', 'Centro Privado de Educación Primaria y Secundaria El Prado', 40.4972833, -3.7029033, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167574', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria El Ardal', 40.5977381, -3.5861077, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167575', 'education', 'school', 'Centro Privado de Educación Infantil Reina de los Ángeles', 40.450838, -3.6857573, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167593', 'education', 'school', 'Escuela Infantil Privada Nuestra Señora de los Dolores', 40.4308428, -3.7060322, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167597', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Nuestra Señora de las Nieves', 40.4459524, -3.6140021, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167607', 'education', 'school', 'Colegio San Vicente', 40.4269984, -3.6072162, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167608', 'education', 'school', 'Centro Privado de Educación Infantil Virgen de Begoña', 40.4870159, -3.6885649, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167609', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Teide IV', 40.4335241, -3.6477394, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167610', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Santo Ángel de la Guarda', 40.4456264, -3.6143057, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167617', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria San Javier', 40.3975606, -3.7020249, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167620', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria San Antonio', 40.4507065, -3.7032159, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167623', 'education', 'school', 'Kindergarten La Salle', 40.4498579, -3.6854407, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167624', 'education', 'school', 'Escuela Infantil Privada San Roque', 40.3891325, -3.7363478, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167628', 'education', 'high_school', 'Centro Privado de Educación Especial Instituto San José', 40.3630969, -3.7749985, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167666', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Santa Beatriz de Silva', 40.3806883, -3.7296944, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167668', 'education', 'school', 'Colegio Con-Pe', 40.3880584, -3.7417133, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167676', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Amorós', 40.3691743, -3.7564839, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167696', 'education', 'school', 'Escuela Infantil Privada Jardín Kinderland', 40.4559471, -3.692985, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167700', 'education', 'school', 'Centro Privado de Educación Especial María Corredentora', 40.4541697, -3.6137583, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167703', 'education', 'high_school', 'Centro Privado de Educación Secundaria Marín Amat', 40.4270218, -3.7017956, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167704', 'education', 'school', 'Hansel y Grethel', 40.4466061, -3.6802667, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167705', 'education', 'school', 'Antiguo Colegio Hispanidad', 40.3785709, -3.7467054, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167709', 'education', 'school', 'Institut.Hispano Americano de la Palabra', 40.4600803, -3.6547379, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167710', 'education', 'school', 'Centro Privado de Educación Especial Alenta', 40.5229397, -3.6894414, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167717', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Santa María de la Hispanidad', 40.4532614, -3.6113927, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167722', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Corazón de María', 40.438428, -3.6458623, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167737', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Huérfanos de la Armada', 40.4712848, -3.6669014, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167794', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria Nuestra Señora de la Merced', 40.3925091, -3.7355487, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167804', 'education', 'high_school', 'Centro Privado de Educación Secundaria Nuestra Señora de Gracia', 40.3596648, -3.6940268, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167805', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Liceo Madariaga', 40.4351468, -3.6413508, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167808', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Nuestra Señora de las Escuelas Pías', 40.3893443, -3.7538461, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167811', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Colegio la Milagrosa', 40.3821654, -3.7453196, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167813', 'education', 'school', 'Colegio Begoña', 40.4372118, -3.6480012, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167817', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Natividad de Nuestra Señora', 40.4325726, -3.6711536, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167819', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Minerva', 40.4072044, -3.6081327, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167821', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Madres Mercedarias de D. Juan de Alarcón', 40.4215066, -3.7021039, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167823', 'education', 'school', 'Centro Privado de Educación Infantil Santa Claus', 40.4596414, -3.6503592, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167824', 'education', 'school', 'Colegio Santa Cristina', 40.414614, -3.7285043, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167829', 'education', 'school', 'Colegio Cervantes', 40.38513, -3.7253361, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167835', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria San Fermín', 40.3727453, -3.6921875, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167843', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria Sagrados Corazones', 40.3570121, -3.694003, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167857', 'education', 'high_school', 'Centro Privado Concertado de Educación Infantil, Primaria y Secundaria San Alberto Magno', 40.40237, -3.7239089, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167859', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Centro Cultural Salmantino', 40.3953054, -3.6645157, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167860', 'education', 'school', 'Antiguo Colegio Viancor', 40.4240493, -3.6621031, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167864', 'education', 'school', 'Centro Privado de Educación Infantil Los Lapazares', 40.3915052, -3.6623803, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167866', 'education', 'school', 'Colegio británico Maxwell School', 40.4457699, -3.685059, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167869', 'education', 'school', 'Mi Cole', 40.4530898, -3.5916123, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167870', 'education', 'school', 'Escuela Infantil Privada Los Pinos', 40.4230978, -3.663176, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167872', 'education', 'school', 'Centro Privado de Educación Especial Los Álamos', 40.4497314, -3.6824442, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167876', 'education', 'school', 'Centro Docente Extranjero en España Union-Chrétienne de Saint Chaumond', 40.4458753, -3.6809785, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167886', 'education', 'school', 'Colegio Virgen de La Luz', 40.4265814, -3.664748, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167902', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Centro Cultural Elfo', 40.4340867, -3.6489097, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167905', 'education', 'school', 'Colegio Stoa Liceo', 40.4218935, -3.6644886, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167908', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Liceo Ibérico', 40.394305, -3.7102697, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167928', 'education', 'school', 'Colegio de Educación Infantil y Primaria Ciudad de Badajoz', 40.3837547, -3.7789832, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167929', 'education', 'school', 'Sagrada Familia', 40.4230314, -3.657173, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167939', 'education', 'high_school', 'Centro Privado de Educación Secundaria Darío Estudio', 40.4224323, -3.7098461, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167942', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Sagrado Corazón', 40.4943477, -3.6891964, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167946', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria San José-lucero', 40.4038146, -3.7462856, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167949', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Escuela Profesional Javeriana', 40.4298609, -3.7069054, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167956', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Santa María del Yermo', 40.4410303, -3.7165381, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167957', 'education', 'school', 'Colegio de Educación Infantil y Primaria Alcalde de Móstoles', 40.3804575, -3.7762829, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167959', 'education', 'high_school', 'Instituto Politécnico N.1 del Ejército', 40.3689252, -3.7525477, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167966', 'education', 'school', 'Colegio de Educación Infantil y Primaria Ciudad de Guadalajara', 40.4590033, -3.5849421, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167967', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Afuera II', 40.4107469, -3.7129528, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167968', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Gonzalez Cañadas', 40.4284328, -3.7023644, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167969', 'education', 'school', 'Academia J.E.A.', 40.426749, -3.6943198, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167970', 'education', 'school', 'Torval''l Formación', 40.4259839, -3.698532, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167971', 'education', 'school', 'Colegio de Educación Infantil y Primaria Ciudad de Zaragoza', 40.4605125, -3.5911118, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167975', 'education', 'high_school', 'Centro Privado de Educación Secundaria Aries', 40.4227116, -3.6828789, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167977', 'education', 'high_school', 'Centro Privado de Educación Secundaria Díaz Balaguer', 40.4341776, -3.7175148, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167978', 'education', 'high_school', 'Centro Privado de Educación Secundaria Vox', 40.4219785, -3.7091246, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167979', 'education', 'school', 'Quick', 40.4232128, -3.7100844, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266167983', 'education', 'school', 'Colegio Besana', 40.4371671, -3.6409337, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168005', 'education', 'school', 'Colegio de Educación Especial Francisco del Pozo', 40.4942106, -3.686481, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168014', 'education', 'school', 'Centro Privado de Educación Especial Centro Nuevo de Pedagogía', 40.4485677, -3.6827155, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168021', 'education', 'school', 'Escuela Infantil Privada Monseñor Alves Bras', 40.3977434, -3.7698471, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168024', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Afuera I', 40.4143134, -3.7012985, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168050', 'education', 'high_school', 'Centro Privado de Educación Especial Antonio Vicente Mosquete;Centro Privado de Educación Primaria y Secundaria Antonio Vicente Mosquete', 40.4665254, -3.679087, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168064', 'education', 'school', 'Liceo San Luis', 40.3191881, -3.8629006, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168073', 'education', 'school', 'Escuela Infantil Privada La Inmaculada', 40.3230979, -3.8604903, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168087', 'education', 'school', 'Colegio de Educación Infantil y Primaria Virgen de la Ribera Fund. Hnos.', 40.5096019, -3.5314411, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168089', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Internacional Eurovillas', 40.3539983, -3.2721305, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168090', 'education', 'high_school', 'Colegio de Educación Infantil, Primaria y Secundaria Juan de Goyeneche', 40.3599256, -3.2444768, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168091', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria institucion Profesional Salesiana', 40.3745662, -3.7528567, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168095', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria Cervantes', 40.3791298, -3.728264, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168101', 'education', 'school', 'Escuela Infantil Privada Santa Mónica', 40.4070118, -3.7518892, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168102', 'education', 'school', 'Fisbis', 40.39289, -3.7031458, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168104', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Teide II', 40.4157649, -3.7091042, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168105', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Bienaventurada Virgen María', 40.3963134, -3.7474666, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168106', 'education', 'school', 'Escuela Infantil Privada Vida', 40.4105917, -3.6492267, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168110', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria San Pablo', 40.8164419, -3.7586039, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168111', 'education', 'school', 'Colegio de Educación Infantil y Primaria Nuestra Señora del Remolino', 40.7372333, -3.5808227, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168122', 'education', 'school', 'Colegio de Educación Infantil y Primaria Virgen de la Peña Sacra', 40.7273335, -3.8679711, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168124', 'education', 'school', 'Colegio de Educación Infantil y Primaria San José', 40.1988508, -3.8036942, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168125', 'education', 'high_school', 'Instituto de Educación Secundaria Las Veredillas', 40.4661258, -3.4710019, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168127', 'education', 'school', 'Colegio de Educación Infantil y Primaria Nuestra Señora del Pilar', 40.1844195, -3.7766788, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168128', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria San Juan Evangelista', 40.4596107, -3.4780448, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168130', 'education', 'high_school', 'Instituto de Educación Secundaria Isaac Peral', 40.4556716, -3.4529066, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168131', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria J.a.b.y.', 40.4568865, -3.479897, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168133', 'education', 'school', 'Colegio de Educación Infantil y Primaria Nuestra Señora del Rosario', 40.3984809, -3.3596008, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168137', 'education', 'school', 'Colegio de Educación Infantil y Primaria Cardenal Cisneros', 40.8251361, -3.5370816, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168138', 'education', 'school', 'Colegio de Educación Infantil y Primaria Nuestra Señora de Lourdes', 40.5750714, -3.9491343, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168140', 'education', 'high_school', 'Instituto de Educación Secundaria Joan Miró', 40.5580463, -3.6243419, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168144', 'education', 'school', 'Colegio de Educación Infantil y Primaria Francisco Carrillo', 40.5477708, -3.6291189, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168145', 'education', 'school', 'Centro Privado de Educación Infantil Mi Cole', 40.5461234, -3.6301597, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168148', 'education', 'school', 'Colegio de Educación Infantil y Primaria Gabriel y Galán', 40.4574037, -3.4823458, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168149', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria San Juan Bosco', 40.4525036, -3.460398, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168150', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Alba', 40.4604718, -3.4825006, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168151', 'education', 'school', 'Colegio de Educación Infantil y Primaria Miguel de Cervantes', 40.4645949, -3.4708497, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168152', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria El Pilar', 40.7546895, -3.7856727, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168196', 'education', 'school', 'Colegio de Educación Infantil y Primaria El Buen Gobernador', 40.4558483, -3.4817632, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168245', 'education', 'school', 'Colegio de Educación Infantil y Primaria Virgen de Navalazarza', 40.6819192, -3.6166477, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168251', 'education', 'school', 'Colegio de Educación Infantil y Primaria San José', 40.5543737, -3.8868841, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168254', 'education', 'school', 'Colegio de Educación Infantil y Primaria General Izquierdo', 40.2696707, -3.5923088, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168255', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Real Colegio Alfonso XII', 40.5896829, -4.1482243, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168256', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria La Inmaculada Concepción', 40.5925726, -4.1425053, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168261', 'education', 'school', 'Centro Privado de Educación Especial Gil Gayarre', 40.4390044, -3.8390795, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168269', 'education', 'school', 'Colegio de Educación Infantil y Primaria Nuestra Señora de Navahonda', 40.4984702, -4.2346259, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168283', 'education', 'school', 'Colegio de Educación Infantil y Primaria Santo Domingo', 40.3419347, -3.8246669, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168291', 'education', 'school', 'Colegio de Educación Infantil y Primaria Severo Ochoa', 40.4603357, -3.4732559, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168329', 'education', 'school', 'Santa Catalina', 40.4494184, -3.8662125, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168333', 'education', 'school', 'Circulo Ecca', 40.4325989, -3.6759404, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168335', 'education', 'school', 'Parque', 40.3789296, -3.7507826, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168336', 'education', 'school', 'Centro Privado de Educación Infantil y Primaria Dos Parques', 40.3972382, -3.7033722, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168337', 'education', 'school', 'Escuela Infantil Privada Cuna de Jesús', 40.4350174, -3.6711865, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168346', 'education', 'high_school', 'Instituto de Educación Secundaria Nuestra Señora de la Victoria de Lepanto', 40.1670212, -3.276612, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168348', 'education', 'school', 'Colegio de Educación Infantil y Primaria Nuestra Señora de la Victoria', 40.167521, -3.2823331, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168349', 'education', 'school', 'Colegio de Educación Infantil y Primaria San Andrés', 40.6595687, -3.7754484, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168352', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Colegio Alcalá', 40.358788, -3.9046221, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168354', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Inglan', 40.3041219, -3.7378072, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168360', 'education', 'school', 'Escuela Infantil Privada Projardin Retiro', 40.4155186, -3.6726772, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168368', 'education', 'school', 'Colegio de Educación Infantil y Primaria Ramón Linacero', 40.6378627, -3.4539447, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168370', 'education', 'school', 'Colegio de Educación Infantil y Primaria Gregorio Canella', 40.4384478, -3.2760415, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168371', 'education', 'school', 'Colegio de Educación Infantil y Primaria Valdemera', 40.3675772, -3.4843254, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168374', 'education', 'school', 'Colegio de Educación Infantil y Primaria San Lucas', 40.4905715, -3.9654547, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168376', 'education', 'school', 'Colegio de Educación Infantil y Primaria Santiago Apóstol', 40.4543562, -3.9932268, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168377', 'education', 'high_school', 'Centro Privado de Educación Primaria y Secundaria Seminario Arzobispal la Inmaculada y San Dámaso', 40.3125316, -4.5141042, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168402', 'education', 'high_school', 'Instituto de Educación Secundaria Ramiro de Maeztu', 40.4428104, -3.6878857, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168408', 'education', 'school', 'Escuela Infantil Privada Andal Alameda', 40.4558317, -3.5885942, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168420', 'education', 'school', 'Centro Privado de Educación Infantil Pipo''s', 40.3990263, -3.699962, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168435', 'education', 'school', 'Colegio de Educación Infantil y Primaria Parque de Lisboa', 40.3502736, -3.8138117, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168437', 'education', 'school', 'Escuela Infantil Privada San Alonso de Orozco', 40.4458861, -3.717981, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168444', 'education', 'school', 'Colegio de Educación Infantil y Primaria Daniel Vázquez Díaz', 40.648116, -3.9970351, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168445', 'education', 'school', 'Colegio Público Isabel La Católica', 40.6576706, -3.7656704, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168446', 'education', 'school', 'Centro Privado de Educación Especial La Purísima', 40.4274073, -3.6579234, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168450', 'education', 'school', 'Colegio de Educación Infantil y Primaria Valdepalitos', 40.5482939, -3.6465955, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168452', 'education', 'school', 'Colegio de Educación Infantil y Primaria Federico García Lorca', 40.315609, -3.4778994, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168463', 'education', 'school', 'Centro Privado de Educación Infantil Nazaret', 40.4417984, -3.6766629, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168466', 'education', 'school', 'Colegio de Educación Infantil y Primaria Mariano Benlliure', 40.6223953, -4.0189033, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168534', 'education', 'school', 'Centro Docente Extranjero En España Scuola Statale Italiana de Madrid (italiano)', 40.441934, -3.6952191, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168539', 'education', 'school', 'Centro Público de Educación de Personas Adultas Cultural Moratalaz', 40.403818, -3.6496481, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168550', 'education', 'school', 'Centro Público de Educación de Personas Adultas Casa de la Cultura', 40.3058342, -3.732302, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168556', 'education', 'school', 'Escuela Infantil Tren de Piscis', 40.4108741, -3.6538638, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168560', 'education', 'school', 'Centro Docente Extranjero En España Numont School (britanico)', 40.4560206, -3.6493561, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168561', 'education', 'school', 'Centro Docente Extranjero En España Hof Der Lage Landen (países Bajos)', 40.4702083, -3.6638364, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168567', 'education', 'school', 'Centro Privado de Educación Especial Leo Kanner', 40.4898707, -3.7026257, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168572', 'education', 'school', 'Centro Docente Extranjero En España Colegio Libio de Madrid (libia, Alum. Extr.)', 40.4456314, -3.6818229, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168573', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Organizacion Profesional Española, Opesa', 40.4271234, -3.6699409, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168574', 'education', 'school', 'El Patito Feo', 40.2514058, -3.8281896, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168575', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Padre Manyanet', 40.5505681, -3.6665409, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168576', 'education', 'school', 'Magdalena Aulina', 40.4638727, -3.663684, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168589', 'education', 'school', 'Escuela Infantil Privada Agarimo', 40.4341757, -3.7149093, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168590', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Centro de Estudios Profesionales (c.e.p.)', 40.4889819, -3.3600118, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168591', 'education', 'school', 'Universidad Popular San Sebastián de los Reyes-Cea', 40.5543609, -3.6328343, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168595', 'education', 'school', 'Centro Público de Educación de Personas Adultas La Albufera', 40.3928289, -3.662711, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168606', 'education', 'school', 'Centro Privado de Educación Infantil Los Delfines', 40.4538816, -3.4738471, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168612', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Willoughby College', 40.4617099, -3.6768545, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168614', 'education', 'school', 'Centro Privado de Educación Infantil Verbo Encarnado', 40.4456395, -3.7002434, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168630', 'education', 'school', 'Colegio de Educación Infantil y Primaria Antonio Machado', 40.4760923, -3.3875125, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168635', 'education', 'high_school', 'Instituto de Educación Secundaria Alameda de Osuna', 40.4603155, -3.589105, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168674', 'education', 'school', 'Colegio de Educación Infantil y Primaria Miguel Hernández', 40.303968, -3.4381647, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168677', 'education', 'school', 'Colegio de Educación Infantil y Primaria Miguel Servet', 40.3940299, -3.7368841, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168682', 'education', 'high_school', 'Instituto de Educación Secundaria Blas de Otero', 40.3890501, -3.7624389, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168692', 'education', 'school', 'Escuela Infantil Privada Arlequín', 40.3943263, -3.7523662, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168698', 'education', 'school', 'Colegio de Educación Infantil y Primaria La Latina', 40.3886546, -3.7625512, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168701', 'education', 'school', 'C. Est.Profes.Advos. y Linguisticos (Cepal)', 40.4298593, -3.6712953, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168706', 'education', 'school', 'Colegio de Educación Infantil y Primaria Carretas', 40.3022991, -3.4371501, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168710', 'education', 'school', 'Centro Privado de Educación Infantil Santa Luisa', 40.3529246, -3.6805743, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168712', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Escuela Politecnica Giner', 40.3942741, -3.7655713, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168721', 'education', 'school', 'Niro', 40.4078303, -3.6820848, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168727', 'education', 'school', 'Pequeñines', 40.379085, -3.7507419, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168728', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Centro de Formación Técnica', 40.4148943, -3.7035557, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168731', 'education', 'school', 'Colegio de Educación Infantil y Primaria León Felipe', 40.2993366, -3.4442292, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168740', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Hease', 40.3481158, -3.7073252, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168745', 'education', 'school', 'Yaki', 40.4973066, -3.6885068, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168746', 'education', 'school', 'Colegio de Educación Infantil y Primaria Infantas Elena y Cristina', 40.5439422, -3.6186728, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168748', 'education', 'school', 'Escuela Infantil Privada Magos', 40.4152588, -3.6752577, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168759', 'education', 'school', 'El Patio de Mi Casa', 40.4770912, -3.7325401, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168761', 'education', 'school', 'Escuela Infantil Privada Jardín de las Delicias', 40.397388, -3.6923674, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168762', 'education', 'school', 'Escuela Infantil Privada La Cometa', 40.3808099, -3.708656, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168763', 'education', 'school', 'Escuela Infantil Privada Dálmatas', 40.3233553, -3.8512539, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168771', 'education', 'school', 'Colegio de Educación Especial Infanta Elena', 40.4435394, -3.6500734, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168772', 'education', 'school', 'Escuela Infantil Privada María', 40.303766, -3.7286658, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168778', 'education', 'school', 'Centro Privado de Educación de Personas Adultas Practivox', 40.4111037, -3.6963686, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168779', 'education', 'school', 'Escuela Municipal de Educación de Personas Adultas Escuela Municipal de Educación de Adultos', 40.4600413, -3.474516, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168790', 'education', 'school', 'Colegio de Educación Infantil y Primaria Padre Jerónimo', 40.5920963, -3.4976075, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168792', 'education', 'school', 'Escuela Infantil Privada La Casita de los Pitufos II', 40.4071037, -3.6485396, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168796', 'education', 'school', 'Escuela Infantil Privada San Vicente de Paúl', 40.3850034, -3.7260154, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168802', 'education', 'school', 'Colegio de Educación Infantil y Primaria Calderón de la Barca', 40.470602, -3.5840634, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168818', 'education', 'school', 'Colegio de Educación Infantil y Primaria Rosa Chacel', 40.6316058, -4.0151792, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168825', 'education', 'school', 'institucion Artística de Enseñanza (IADE)', 40.4271337, -3.6862022, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168827', 'education', 'school', 'Escuela Superior de Canto Escuela Superior de Canto de Madrid', 40.4244706, -3.707302, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168836', 'education', 'school', 'Escuela Infantil Privada Mi Cole-ceden', 40.3028767, -3.7342354, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168837', 'education', 'school', 'La Locomotora', 40.4784006, -3.7059276, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168839', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Nueva Castilla', 40.3772231, -3.6192572, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168843', 'education', 'school', 'Antiguo Centro de E.E. Virgen de Nuria', 40.4605049, -3.6577024, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168845', 'education', 'school', 'Centro de Enseñanza Audiovisual (C.E.A.)', 40.6306008, -4.0054447, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168847', 'education', 'school', 'A.T.A.M.', 40.4411215, -3.8234115, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168849', 'education', 'high_school', 'Instituto de Educación Secundaria José Luis Sampedro', 40.6103592, -3.708456, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168851', 'education', 'school', 'Manuel Aguilar Hardisson', 40.5481704, -3.6289327, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168867', 'education', 'school', 'Colegio de Educación Infantil y Primaria Santo Domingo de Guzmán', 40.2596107, -3.8221864, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168879', 'education', 'school', 'Colegio de Educación Infantil y Primaria Parque de Cataluña', 40.5420224, -3.6387534, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168911', 'education', 'school', 'Centro Público de Educación de Personas Adultas Mariano José de Larra', 40.2411809, -3.7020138, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168914', 'education', 'school', 'Centro Comarcal de Educación de Personas Adultas Colmenar Viejo', 40.6583073, -3.7679455, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168920', 'education', 'school', 'Aula Hospitalaria Hospital Gregorio Marañón', 40.419323, -3.6713004, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168924', 'education', 'high_school', 'Centro Privado de Educación Secundaria Santa Rosa de Lima', 40.4633849, -3.647009, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168934', 'education', 'school', 'Escuela Infantil Privada Eduka, Escuela Infantil', 40.4804481, -3.7267675, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168937', 'education', 'school', 'Colegio de Educación Infantil y Primaria Nuestra Señora de la Luz', 40.3438685, -3.7057673, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168947', 'education', 'school', 'Colegio de Educación Infantil y Primaria Ramón Carande', 40.4615341, -3.4651176, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168973', 'education', 'school', 'Centro de enseñanza Cenec', 40.4456104, -3.706672, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168974', 'education', 'school', 'Colegio de Educación Infantil y Primaria Jacinto Benavente', 40.580333, -4.0100539, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168975', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Colegio Addis', 40.3475234, -3.708723, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266168979', 'education', 'school', 'Escuela de Arte de Madrid N.2', 40.4170421, -3.6954101, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169002', 'education', 'high_school', 'Centro Privado de Educación Secundaria Col. britanico de Madrid En Somosaguas', 40.4123151, -3.7916551, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169033', 'education', 'school', 'Colegio de Educación Infantil y Primaria Manuel Núñez de Arenas', 40.291219, -3.7469449, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169039', 'education', 'school', 'Colegio de Educación Infantil y Primaria Profesor Tierno Galván', 40.5400352, -3.6298548, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169043', 'education', 'school', 'Colegio de Educación Infantil y Primaria Pedro Muñoz Seca', 40.5982194, -3.5032796, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169067', 'education', 'high_school', 'Instituto de Educación Secundaria Julio Palacios', 40.543673, -3.6184814, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169074', 'education', 'school', 'Centro Privado de Educación Infantil Nazaret', 40.3919789, -3.6472591, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169075', 'education', 'school', 'Colegio de Educación Especial Miguel Hernández', 40.6588922, -3.7636476, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169114', 'education', 'high_school', 'Instituto de Educación Secundaria Salvador Dalí', 40.4393997, -3.6563957, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169130', 'education', 'high_school', 'Instituto de Educación Secundaria Grande Covián', 40.2967624, -3.4332073, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169155', 'education', 'school', 'Colegio de Educación Infantil y Primaria Enrique Tierno Galván', 40.2870246, -3.7490963, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169160', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Manuel Bartolomé Cossío', 40.279383, -3.7933367, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169162', 'education', 'high_school', 'Instituto de Educación Secundaria Al-satt', 40.5994926, -3.5109551, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169164', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Escuela Técnica de Enseñanzas Especializadas', 40.4482889, -3.707176, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169166', 'education', 'high_school', 'Instituto de Educación Secundaria Gustavo Adolfo Bécquer', 40.6001341, -3.5110312, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169173', 'education', 'high_school', 'Instituto de Educación Secundaria Luís de Góngora', 40.4500134, -3.4725905, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169180', 'education', 'school', 'Escuela Infantil Privada Virgen del Parque', 40.3779132, -3.7536718, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169191', 'education', 'school', 'Escuela Infantil La Jara', 40.3842671, -3.7016118, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169203', 'education', 'school', 'Escuela Infantil Chavalitos', 40.4030559, -3.7482599, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169206', 'education', 'school', 'Escuela Infantil Bärbel Inhelder', 40.5483975, -3.6947663, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169209', 'education', 'school', 'Escuela Infantil La Luna', 40.3443823, -3.684753, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169210', 'education', 'school', 'Escuela Infantil La Caracola', 40.4880852, -3.6848848, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169213', 'education', 'school', 'Escuela Infantil Roger de Flor', 40.3936967, -3.7326034, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169217', 'education', 'school', 'Escuela Infantil Vallehermoso', 40.4354905, -3.7091922, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169223', 'education', 'school', 'Colegio de Educación Infantil y Primaria Virgen de Valderrabe', 40.590339, -3.4954905, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169225', 'education', 'school', 'Academia Toan', 40.4362587, -3.6385389, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169226', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Los Sauces', 40.5676592, -3.8981394, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169227', 'education', 'school', 'Centro Privado de Educación Infantil Ramón y Cajal', 40.4612031, -3.6584876, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169228', 'education', 'school', 'Centro Público de Educación de Personas Adultas Pan Bendito', 40.3771653, -3.7345139, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169230', 'education', 'school', 'Centro Público de Educación de Personas Adultas Fuencarral', 40.4958979, -3.6936021, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169232', 'education', 'school', 'Colegio de Educación Infantil y Primaria Antonio Machado', 40.3137058, -3.4794182, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169248', 'education', 'school', 'Escuela de Adultos de Arganzuela', 40.3943159, -3.6935148, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169253', 'education', 'school', 'Centro Público de Educación de Personas Adultas Canillejas', 40.4373479, -3.6082446, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169266', 'education', 'school', 'Centro Privado de Educación de Personas Adultas Nazaret', 40.3971227, -3.7518825, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169270', 'education', 'school', 'Centro de Educación Especial Cisen', 40.4493364, -3.6837492, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169271', 'education', 'school', 'Escuela Municipal de Educación de Personas Adultas Escuela de Adultos de Moncloa', 40.4349752, -3.7186348, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169272', 'education', 'school', 'Escuela Infantil Privada Los Álamos', 40.2332895, -3.9910887, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169273', 'education', 'school', 'Centro Público de Educación de Personas Adultas Pedro Martínez Gavito', 40.5942522, -4.1483549, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169274', 'education', 'school', 'Centro Público de Educación de Personas Adultas Enrique Tierno Galván', 40.2983953, -3.4323164, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169279', 'education', 'school', 'Colegio de Educación Infantil y Primaria Los Jarales-Monterrozas', 40.5195962, -3.9040753, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169280', 'education', 'school', 'Colegio de Educación Infantil y Primaria Valderrey', 40.6027893, -3.4996418, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169295', 'education', 'high_school', 'Instituto de Educación Secundaria María Guerrero', 40.6232815, -4.005708, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169298', 'education', 'high_school', 'Centro Privado de Educación Secundaria T.e.m.s.', 40.4665952, -3.779584, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169299', 'education', 'school', 'Escuela Infantil Privada Los Álamos', 40.4459587, -4.0079742, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169302', 'education', 'school', 'Colegio de Educación Infantil y Primaria Uno de Mayo', 40.4629873, -3.4624765, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169303', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Bra-institucion', 40.443705, -3.6381186, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169319', 'education', 'high_school', 'Instituto de Educación Secundaria Pintor Antonio López', 40.6019676, -3.7025193, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169322', 'education', 'school', 'Colegio de Educación Infantil y Primaria Monte de el Pardo', 40.5171311, -3.7743983, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169326', 'education', 'school', 'Escuela Infantil Privada Little Duck', 40.5413335, -3.9008112, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169330', 'education', 'school', 'Centro Público de Educación de Personas Adultas Cid Campeador las Águilas - Cuatro Vientos', 40.3820024, -3.7706532, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169331', 'education', 'school', 'Colegio de Educación Infantil y Primaria Profesor Don Enrique Tierno Galván', 40.6259564, -3.9989852, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169335', 'education', 'school', 'Centro Público de Educación de Personas Adultas Oporto', 40.3862315, -3.7249473, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169336', 'education', 'school', 'Centro Público de Educación de Personas Adultas El Pontón', 40.6286039, -4.0102059, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169337', 'education', 'school', 'Centro Público de Educación de Personas Adultas Ciudad Lineal', 40.4292596, -3.6323355, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169338', 'education', 'school', 'Centro Público de Educación de Personas Adultas Dulce Chacón', 40.477176, -3.6497415, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169339', 'education', 'school', 'Centro Público de Educación de Personas Adultas El Buen Gobernador', 40.4558635, -3.4815958, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169343', 'education', 'school', 'Centro Público de Educación de Personas Adultas Gloria Fuertes', 40.2869934, -4.0127644, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169346', 'education', 'school', 'Centro Público de Educación de Personas Adultas Mancomunidad del Suroeste', 40.2167042, -3.8525243, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169347', 'education', 'school', 'Centro Público de Educación de Personas Adultas Atalayas', 40.7371912, -3.5823921, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169349', 'education', 'school', 'Centro Público de Educación de Personas Adultas Hermanos Correa', 40.1872756, -3.6897263, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169350', 'education', 'school', 'Centro Docente Extranjero En España Scuola Materna Italiana de Madrid (italiano)', 40.4421204, -3.6951889, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169351', 'education', 'school', 'Escuela Infantil Privada Santa Rosalía', 40.4661103, -3.6310724, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169352', 'education', 'school', 'Colegio de Educación Infantil y Primaria Jorge Guillén', 40.2121964, -3.5820255, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169362', 'education', 'school', 'Colegio de Educación Infantil y Primaria C.r.a. el Jarama', 40.7682369, -3.5799847, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169366', 'education', 'school', 'Colegio de Educación Infantil y Primaria C.r.a. Amigos de la Paz', 40.4651717, -3.270642, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169371', 'education', 'school', 'Escuela Infantil La Paloma', 40.4106956, -3.7116612, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169376', 'education', 'school', 'Escuela Infantil Privada Delphos', 40.4410373, -3.6476632, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169380', 'education', 'school', 'Centro Privado de Educación Infantil Can-ta-chimutri (sol y Luna)', 40.467202, -3.7236953, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169381', 'education', 'school', 'Crio''s', 40.1862304, -3.6790497, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169391', 'education', 'school', 'Escuela Infantil Los Enebros', 40.6587796, -3.763106, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169402', 'education', 'school', 'Escuela Infantil Mafalda', 40.2908755, -3.745406, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169405', 'education', 'school', 'Oscus-Ventilla', 40.4720527, -3.6934633, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169406', 'education', 'school', 'Escuela Municipal de Educación de Personas Adultas Escuela Municipal de Educación de Adultos', 40.4795434, -3.3650694, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169413', 'education', 'school', 'Centro Público de Educación de Personas Adultas Villarejo de Salvanés', 40.167178, -3.275898, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169414', 'education', 'school', 'Centro Público de Educación de Personas Adultas San Martín de Valdeiglesias', 40.3635183, -4.3982285, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169415', 'education', 'school', 'Centro Público de Educación de Personas Adultas Paracuellos del Jarama', 40.5026505, -3.5326727, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169416', 'education', 'school', 'Centro Público de Educación de Personas Adultas Torres de la Alameda', 40.4009531, -3.3608889, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169417', 'education', 'school', 'Escuela Municipal de Educación de Personas Adultas Escuela Municipal de Adultos Usera', 40.3716401, -3.692058, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169418', 'education', 'school', 'Escuela Municipal de Educación de Personas Adultas Escuela de Adultos de Barajas', 40.4716708, -3.5853696, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169419', 'education', 'school', 'Centro Público de Educación de Personas Adultas Vista Alegre', 40.3836216, -3.7404659, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169422', 'education', 'school', 'Escuela Infantil Fortuna', 40.3582826, -3.7849202, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169425', 'education', 'school', 'Escuela Infantil El Prado', 40.3022543, -3.7367965, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169426', 'education', 'school', 'Escuela Infantil El Tomillar', 40.574719, -3.9535145, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169427', 'education', 'school', 'Escuela Infantil Jeromín', 40.3335149, -3.7677877, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169428', 'education', 'school', 'Escuela Infantil Lope de Vega', 40.3243423, -3.7652946, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169432', 'education', 'school', 'Escuela Infantil-casa de Niños Campanilla', 40.2871185, -4.0128839, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169434', 'education', 'school', 'Escuela Infantil Las Cigüeñas', 40.3970062, -3.491472, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169437', 'education', 'school', 'Escuela Infantil Trébol', 40.5963152, -4.1481958, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169439', 'education', 'school', 'Escuela Infantil La Comba', 40.5581662, -3.6287045, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169440', 'education', 'school', 'Escuela Infantil Las Cumbres', 40.5538135, -3.6307631, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169445', 'education', 'school', 'Escuela Infantil Monte Abantos', 40.5916802, -4.1444593, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169446', 'education', 'school', 'Escuela Infantil Los Pingüinos', 40.3462423, -3.8219405, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169449', 'education', 'school', 'Escuela Infantil Municipal de Arganda del Rey', 40.2944015, -3.4356426, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169450', 'education', 'school', 'Escuela Infantil Loreto', 40.4625068, -3.4755658, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169453', 'education', 'school', 'Escuela Infantil Puerta de Madrid', 40.4796684, -3.3753289, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169456', 'education', 'school', 'Escuela Infantil-casa de Niños Lozoya', 40.9498525, -3.7909201, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169457', 'education', 'school', 'Escuela Infantil-casa de Niños Montejo de la Sierra', 41.0574302, -3.5354576, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169458', 'education', 'school', 'Escuela Infantil Miraflores de la Sierra', 40.8125484, -3.7621415, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169459', 'education', 'school', 'Escuela Infantil-casa de Niños Nuevo Baztán', 40.3607364, -3.2433682, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169460', 'education', 'school', 'Escuela Infantil-casa de Niños Navalagamella', 40.4688581, -4.1243843, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169464', 'education', 'school', 'Escuela Infantil-casa de Niños Sol y Luna', 40.3802239, -4.2172749, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169466', 'education', 'school', 'Escuela Infantil-casa de Niños La Ballenita', 40.1187491, -3.1617649, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169467', 'education', 'school', 'Escuela Infantil-casa de Niños Los Enanitos', 40.1833191, -3.1065331, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169469', 'education', 'school', 'Garganta De Los Montes', 40.9226296, -3.6850192, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169471', 'education', 'school', 'Escuela Infantil-casa de Niños Aventuras', 40.3288075, -3.7547978, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169472', 'education', 'school', 'Escuela Infantil Momo', 40.2420092, -3.7747961, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169475', 'education', 'school', 'Escuela Infantil-casa de Niños A Chupé', 40.3242231, -4.199891, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169476', 'education', 'school', 'Escuela Infantil-casa de Niños Arganda del Rey', 40.3152856, -3.4808298, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169479', 'education', 'school', 'Escuela Infantil La Cabrera', 40.86772, -3.6146961, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169480', 'education', 'school', 'Escuela Infantil-casa de Niños Atrapasueños', 40.3034417, -4.4399848, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169481', 'education', 'school', 'Escuela Infantil La Cañada de Ardoz', 40.4573873, -3.4534343, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169486', 'education', 'school', 'Escuela Infantil La Chopera', 40.5405128, -3.6429429, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169487', 'education', 'school', 'Escuela Infantil La Foresta', 40.6124175, -3.7066268, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169489', 'education', 'school', 'Escuela Infantil El Juglar', 40.3333922, -3.8705212, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169491', 'education', 'school', 'Centro Privado de Educación Especial El Despertar', 40.386527, -3.7739609, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169492', 'education', 'school', 'Mery', 40.2687008, -3.9215694, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169497', 'education', 'school', 'Garabatos', 40.5236504, -3.9133716, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169523', 'education', 'school', 'Escuela Infantil Privada Pequeño Koala', 40.404783, -3.615526, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169527', 'education', 'school', 'Escuela Superior de Secretarias', 40.4284363, -3.6852236, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169528', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Centro Escolar Balder', 40.5503921, -3.9030085, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169529', 'education', 'school', 'Academia Triunfo II', 40.329313, -3.7615367, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169537', 'education', 'school', 'Centro Docente Extranjero En España Escuela Iraquí En Madrid (iraquí)', 40.4521719, -3.6334342, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169538', 'education', 'school', 'Reina Cristina', 40.4856767, -3.3598403, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169541', 'education', 'school', 'Niños Jugando', 40.6087785, -3.9388958, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169543', 'education', 'school', 'Escuela Infantil Privada Leo Leo', 40.4827235, -3.3587991, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169544', 'education', 'school', 'Sonrisas', 40.614669, -4.0070621, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169545', 'education', 'high_school', 'Instituto de Educación Secundaria El Escorial', 40.5778889, -4.1292036, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169551', 'education', 'high_school', 'Instituto de Educación Secundaria Las Encinas', 40.4553199, -3.9934592, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169556', 'education', 'high_school', 'Instituto de Educación Secundaria Maestro Juan María Leonet', 40.2716702, -4.3045736, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169558', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Santa María', 40.6381606, -3.9974988, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169559', 'education', 'school', 'Escuela Infantil Soletes', 40.5063235, -3.527944, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169562', 'education', 'school', 'Escuela Infantil Privada La Comba', 40.5469772, -3.6572651, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169563', 'education', 'school', 'El Duende', 40.3223531, -3.8840329, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169565', 'education', 'school', 'Trébol', 40.6311119, -4.0252104, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169566', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Centro de Estudios Financieros', 40.4354795, -3.6974754, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169568', 'education', 'high_school', 'Instituto de Educación Secundaria Alpedrete', 40.6539007, -4.0175014, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169571', 'education', 'school', 'ICE Pablo VI', 40.4545521, -3.6668078, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169572', 'education', 'school', 'Centro Docente Extranjero En España Montessori School el Enebral (britanico)', 40.6395624, -3.9935179, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169573', 'education', 'school', 'Escuela Infantil Privada Gran Vía', 40.4665324, -3.6490202, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169575', 'education', 'school', 'Escuela Infantil Privada Los Angelitos', 40.4728171, -3.8686005, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169579', 'education', 'school', 'Torval''l Formación', 40.4259543, -3.6986063, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169584', 'education', 'school', 'Centro Docente Extranjero En España Centro de Formación Empresarial (alemán)', 40.4739798, -3.6757512, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169587', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Centro Europeo de Estudios Profesionales', 40.4133561, -3.7288, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169589', 'education', 'school', 'Conf.Past.Helad.Repost.Pl.Coci.Comun.Ma.', 40.4018515, -3.6987654, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169592', 'education', 'school', 'Centro Privado de Educación Especial San Carlos', 40.4519177, -3.7984363, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169593', 'education', 'high_school', 'Instituto de Educación Secundaria Pedro de Tolosa', 40.3625776, -4.4050617, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169602', 'education', 'school', 'Centro Público de Educación de Personas Adultas Moncloa', 40.424745, -3.7146664, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169626', 'education', 'school', 'Centro Público de Educación de Personas Adultas Las Rozas', 40.4953164, -3.8767378, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169648', 'education', 'school', 'Centro Privado de Educación Infantil Santa María de Leuca', 40.5951074, -4.139772, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169649', 'education', 'school', 'Centro Público de Educación de Personas Adultas Arganzuela', 40.4006138, -3.6960556, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169657', 'education', 'school', 'Escuela Infantil Gloria Fuertes', 40.2991754, -3.4452054, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169660', 'education', 'school', 'Escuela Infantil Platero y Yo', 40.2596915, -3.8234927, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169661', 'education', 'school', 'Escuela Infantil Pilocha', 40.3937216, -3.4809926, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169662', 'education', 'school', 'Escuela Infantil La Pradera', 40.3972135, -3.7192153, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169663', 'education', 'school', 'Escuela Infantil-casa de Niños Maestra María Ángeles Cabello', 40.8257711, -3.6285363, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169668', 'education', 'school', 'Escuela Infantil-casa de Niños Navalafuente', 40.8234884, -3.6754977, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169685', 'education', 'school', 'Hermanos Grimm', 40.6303442, -3.9944919, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169688', 'education', 'school', 'Escuela Infantil-casa de Niños Titulcia', 40.1366095, -3.5695426, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169689', 'education', 'school', 'Escuela Infantil-casa de Niños El Bosque Encantado', 40.4042068, -3.3603725, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169691', 'education', 'school', 'Escuela Infantil-casa de Niños Tielmes', 40.2472149, -3.3136071, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169692', 'education', 'school', 'Escuela Infantil El Cascanueces', 40.3729739, -3.4872177, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169695', 'education', 'school', 'Escuela Infantil-casa de Niños Valdilecha', 40.293766, -3.3000233, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169702', 'education', 'high_school', 'Instituto de Educación Secundaria Hotel Escuela de la Comunidad de Madrid', 40.5258095, -3.6828081, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169704', 'education', 'school', 'Fontenebro', 40.6507587, -3.9704351, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169707', 'education', 'school', 'Escuela Infantil El Sur', 40.3492002, -3.6989746, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169708', 'education', 'school', 'Escuela Infantil-casa de Niños Lope de Vega', 40.3946793, -3.7235098, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169711', 'education', 'school', 'Escuela Infantil-casa de Niños Morata de Tajuña Nº 1', 40.2289335, -3.4382235, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169713', 'education', 'school', 'Escuela Infantil-casa de Niños Los Cascabeles', 40.3630612, -4.3285264, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169715', 'education', 'school', 'Escuela Infantil El Pocito', 40.7476677, -3.6000493, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169716', 'education', 'school', 'Escuela Infantil-casa de Niños Patones', 40.8558899, -3.483306, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169717', 'education', 'school', 'Escuela Infantil-casa de Niños Cinta y Elisa', 40.3890587, -4.2498979, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169719', 'education', 'school', 'Escuela Infantil-casa de Niños La Luna', 40.3654826, -4.3982662, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169721', 'education', 'school', 'Escuela Infantil-casa de Niños Pozuelo del Rey', 40.3657792, -3.3214505, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169722', 'education', 'school', 'Escuela Infantil-casa de Niños Campo Real Nº 1', 40.3400166, -3.3802701, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169724', 'education', 'school', 'Escuela Infantil-casa de Niños Collado Mediano', 40.6940535, -4.0234251, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169726', 'education', 'school', 'Escuela Infantil-casa de Niños La Olma', 40.4184358, -4.1994762, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169727', 'education', 'school', 'Escuela Infantil Galatea', 40.4704251, -3.366929, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169729', 'education', 'school', 'Escuela Infantil-casa de Niños Elmer', 40.2579196, -3.2334711, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169730', 'education', 'school', 'Escuela Infantil-casa de Niños Colorín Colorado', 40.5462343, -3.3769799, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169731', 'education', 'school', 'Escuela Infantil Amadeo Vives', 40.3968693, -3.7559035, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169732', 'education', 'school', 'Escuela Infantil-casa de Niños Colmenar Viejo', 40.6621364, -3.7793324, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169736', 'education', 'school', 'Escuela de Educación Infantil Parque de Hortaleza', 40.4732282, -3.6464796, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169739', 'education', 'school', 'Escuela Infantil-casa de Niños La Cigüeña', 40.6312981, -3.5217485, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169740', 'education', 'school', 'Escuela Infantil-casa de Niños Fresno de Torote', 40.6226811, -3.3982157, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169745', 'education', 'school', 'Escuela Infantil Gallipatos', 40.2956406, -3.8305993, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169746', 'education', 'school', 'Escuela Infantil Hiedra', 40.4227266, -3.6192962, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169747', 'education', 'school', 'Escuela Infantil Platero', 40.364172, -3.551495, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169750', 'education', 'school', 'Escuela Infantil Parque Coimbra', 40.3138111, -3.9217738, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169755', 'education', 'school', 'Escuela Infantil-casa de Niños Tucan', 40.4759321, -3.375974, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169760', 'education', 'school', 'Escuela Infantil Rosa', 40.4657009, -3.6798926, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169761', 'education', 'school', 'Escuela Infantil-casa de Niños Rincón Florido', 40.7348942, -4.0659919, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169765', 'education', 'school', 'Escuela Infantil La Colina', 40.4714578, -3.5786799, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169790', 'education', 'school', 'Escuela Infantil La Dehesa', 40.5800865, -4.124293, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169794', 'education', 'school', 'Escuela Infantil Los Arcos', 40.6723613, -3.7747249, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169796', 'education', 'school', 'Escuela Infantil La Vaca Flora', 40.6257413, -4.0006154, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169798', 'education', 'school', 'Escuela Infantil-casa de Niños El Castillo', 40.167593, -3.2751071, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169800', 'education', 'school', 'Escuela Infantil-casa de Niños Arco Iris', 40.2113255, -3.1933818, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169801', 'education', 'school', 'Escuela Infantil-casa de Niños Torremocha de Jarama', 40.8340468, -3.4956842, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169802', 'education', 'school', 'Escuela Infantil Torrelaguna', 40.8247767, -3.5370088, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169803', 'education', 'school', 'Escuela Infantil-casa de Niños El Trébol', 40.2047867, -3.8815779, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169804', 'education', 'school', 'Escuela Infantil-casa de Niños El Parque', 40.496906, -4.240307, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169808', 'education', 'school', 'Centro Docente Extranjero En España Montessori School los Fresnos (britan.)', 40.6629509, -4.0298731, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169809', 'education', 'school', 'Andarines', 40.2983151, -3.4392814, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169810', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Los Abetos', 40.7252776, -3.8761895, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169811', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Instituto de Formación Empresarial de la Cámara Oficial de Comercio E Industria de Madrid', 40.457647, -3.6621188, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169813', 'education', 'school', 'El Mundo De Los Niños', 40.569406, -3.9879558, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169815', 'education', 'school', 'Cubas De La Sagra', 40.1986424, -3.8502351, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169817', 'education', 'school', 'Escuela Infantil-casa de Niños Los Huertos', 40.2833667, -3.2091371, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169818', 'education', 'school', 'Escuela Infantil-casa de Niños El Dragón', 40.3280444, -3.5180114, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169819', 'education', 'school', 'Escuela Infantil-casa de Niños Alalpardo', 40.626068, -3.4724387, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169821', 'education', 'school', 'Centro de Estudios Superiores Giner', 40.3942394, -3.7656951, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169827', 'education', 'school', 'Escuela Infantil Privada Alce', 40.4219207, -3.6514873, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169829', 'education', 'school', 'Escuela Infantil El Duende', 40.7203413, -3.9231873, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169830', 'education', 'school', 'Alba', 40.4492999, -3.8121434, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169835', 'education', 'school', 'Colegio de Educación Infantil y Primaria La Encina', 40.5194396, -3.9035554, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169836', 'education', 'school', 'Escuela Infantil Privada Parque Baby Alcalá', 40.484877, -3.3591753, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169837', 'education', 'school', 'Escuela Infantil Privada Denenes', 40.4363288, -3.647407, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169844', 'education', 'school', 'Colegio de Educación Infantil y Primaria La Zarzuela', 40.463575, -3.4509121, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169846', 'education', 'school', 'Escuela Infantil Privada Bambi', 40.6334777, -4.0085323, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169847', 'education', 'school', 'Colegio de Educación Infantil y Primaria Carlos Ruiz', 40.3106294, -4.4927751, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169855', 'education', 'school', 'Zona Casas de Niños Oeste-1, Valdemorillo', 40.5002216, -4.0586908, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169857', 'education', 'school', 'Este-6, Camarma De Esteruelas', 40.546031, -3.3769979, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169860', 'education', 'school', 'Zona Casas de Niños Norte-1, Colmenar Viejo', 40.6606153, -3.7804622, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169861', 'education', 'school', 'Norte-2, Lozoya', 40.9499498, -3.7907699, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169863', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica C.recursos Com.sorda Juan Luis Marroquín', 40.4776141, -3.7286299, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169866', 'education', 'school', 'Zona Casas de Niños Norte-6, Torremocha de Jarama', 40.8255352, -3.5368957, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169868', 'education', 'school', 'Zona Casas de Niños Norte-4, Venturada', 40.7977226, -3.6210118, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169869', 'education', 'school', 'Unidad de Formación e Inserción Laboral San Ramón', 40.2394986, -3.7607546, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169871', 'education', 'school', 'Unidad de Formación e Inserción Laboral Primero de Mayo', 40.3402455, -3.7642719, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169874', 'education', 'school', 'Unidad de Formación e Inserción Laboral Puerta Bonita', 40.3786949, -3.7384439, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169877', 'education', 'school', 'Unidad de Formación e Inserción Laboral El Empecinado', 40.4781869, -3.3672462, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169881', 'education', 'school', 'Escuela Infantil Privada Edoa', 40.3154798, -3.8732807, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169884', 'education', 'school', 'Unidad de Formación e Inserción Laboral Cid Campeador', 40.382116, -3.7701073, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169885', 'education', 'school', 'San Fernando', 40.4487459, -3.5097955, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169886', 'education', 'school', 'Arco Iris', 40.6030507, -3.7077194, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169888', 'education', 'school', 'Escuela Infantil Privada Pitufos', 40.2872095, -4.0117441, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169889', 'education', 'school', 'El Paraíso de los Niños-Woran', 40.4581755, -3.8041005, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169890', 'education', 'school', 'Escuela Infantil Privada Mamá Queca I', 40.4691276, -3.6510863, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169907', 'education', 'school', 'Academia Triunfo IV', 40.3442835, -3.7088484, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169909', 'education', 'school', 'Escuela Infantil Mi Cole', 40.4100165, -3.6369918, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169910', 'education', 'school', 'Zona Casas de Niños Capital-1, Nuestra Señora de la Fuencisla', 40.3803439, -3.6974005, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169911', 'education', 'school', 'Zona Casas de Niños Sur-6, Leganés', 40.3291898, -3.7542017, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169912', 'education', 'school', 'Centro Privado de Educación Especial Peripatos', 40.3898138, -3.7268943, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169913', 'education', 'school', 'Escuela Infantil Privada Luismapetonga-peluches', 40.4189884, -3.6117072, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169915', 'education', 'school', 'Zona Casas de Niños Sur-3, Chapinería', 40.3802308, -4.216889, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169920', 'education', 'school', 'Zona Casas de Niños Sur-4, San Martín de Valdeiglesias', 40.3650918, -4.3965406, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169931', 'education', 'school', 'Zona Casas de Niños Este-4, Villar del Olmo', 40.3365233, -3.2350641, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169933', 'education', 'school', 'Zona Casas de Niños Este-8, Orusco', 40.2832521, -3.2092864, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169935', 'education', 'school', 'Colegio de Educación Infantil y Primaria Las Veredas', 40.5400126, -4.0187682, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169940', 'education', 'school', 'Escuela Infantil Privada Pequeñeces', 40.4586078, -3.4809273, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169943', 'education', 'school', 'Escuela Infantil Privada La Casa de los Duendes', 40.4615488, -3.4576422, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169944', 'education', 'school', 'Escuela Infantil Privada Peluches', 40.299802, -3.8070271, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169946', 'education', 'school', 'Centro Privado de Educación Infantil Ciudad Infantil Mirabal', 40.4181763, -3.9120111, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169947', 'education', 'school', 'Escuela Infantil Privada Las Hadas', 40.5726737, -4.0078058, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169948', 'education', 'school', 'Escuela Infantil Privada Luna Lunera', 40.4553361, -3.4812814, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169949', 'education', 'school', 'Escuela Infantil Privada Garabato', 40.5396438, -3.637184, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169952', 'education', 'school', 'Escuela Infantil Privada El Jardín de los Genios', 40.4262782, -3.7158514, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169954', 'education', 'school', 'Escuela Infantil Privada San Víctor', 40.4818816, -3.7200897, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169955', 'education', 'school', 'Escuela Infantil Privada Little Fem', 40.44511, -3.7185829, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169957', 'education', 'school', 'Duendes', 40.309602, -3.9226068, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169961', 'education', 'school', 'Escuela Infantil-casa de Niños Nuestra Señora de la Fuencisla', 40.3799781, -3.6978304, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169962', 'education', 'school', 'Escuela Infantil-casa de Niños Bravo Murillo', 40.4832131, -3.720462, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169963', 'education', 'school', 'El País de las Maravillas', 40.4540933, -3.874015, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169964', 'education', 'school', 'Escuela Infantil Privada Projardin Ventas', 40.428147, -3.6562961, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169965', 'education', 'school', 'Escuela Infantil Privada Jesús Niño', 40.4385117, -3.6404743, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169966', 'education', 'school', 'Escuela Infantil Privada Lunalunera', 40.598566, -3.7133451, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169970', 'education', 'school', 'Pelusín', 40.4459158, -3.6455801, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169973', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Efa Valdemilanos', 40.6615846, -3.7623227, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169974', 'education', 'school', 'Escuela Infantil Valdelaparra', 40.5424171, -3.6583596, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169975', 'education', 'school', 'Escuela Infantil Barco de Papel', 40.2812242, -4.0143767, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169976', 'education', 'school', 'Escuela Infantil Arco Iris', 40.4912489, -3.3669498, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169980', 'education', 'school', 'Escuela Infantil-casa de Niños Huerta Chica', 40.4211905, -3.5335563, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169981', 'education', 'school', 'Escuela Infantil Los Cedros', 40.4446339, -4.0025071, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169985', 'education', 'school', 'Escuela Infantil Piruetas', 40.4236253, -3.6129154, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169988', 'education', 'school', 'Escuela Infantil-casa de Niños Villavieja de Lozoya', 41.0054058, -3.6705449, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169990', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Alarcón', 40.4407741, -3.80054, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169993', 'education', 'school', 'Escuela Infantil Privada Pequeñines', 40.4023142, -3.7146965, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169996', 'education', 'school', 'Picapinos', 40.438013, -3.7971127, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169998', 'education', 'school', 'Escuela Infantil Privada Nubes', 40.6403908, -3.9913073, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266169999', 'education', 'high_school', 'CEU FP', 40.4535704, -3.7191913, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170002', 'education', 'school', 'Centro Privado de Educación Infantil Cri-cri', 40.4029325, -3.6481668, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170014', 'education', 'high_school', 'Centro Docente Extranjero En España Kinderparadies (alemán)', 40.4918947, -3.7031069, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170017', 'education', 'school', 'Escuela Infantil Privada Chiquilín', 40.3719563, -3.5371792, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170018', 'education', 'school', 'Griñolandia', 40.2129994, -3.8494741, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170019', 'education', 'school', 'Escuela Infantil Privada Los Pinos Ayelem', 40.3393023, -3.8349834, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170022', 'education', 'school', 'Escuela Infantil-casa de Niños República del Brasil', 40.3701865, -3.6895579, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170024', 'education', 'school', 'Canencia', 40.9098642, -3.73968, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170026', 'education', 'school', 'Escuela Infantil Privada Menagar', 40.4562393, -3.6756159, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170029', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Escuela Superior de Formación', 40.403064, -3.6735361, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170030', 'education', 'school', 'La libélula', 40.576565, -3.9575352, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170033', 'education', 'school', 'Escuela Infantil Privada El Tren de los Niños', 40.4799317, -3.6746775, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170034', 'education', 'school', 'Escuela Infantil Privada Ellaluna', 40.4398771, -3.6157483, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170038', 'education', 'school', 'Centro Docente Extranjero En España Saint Anne''s School (britanico)', 40.4604702, -3.6741631, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170041', 'education', 'school', 'Escuela Infantil-casa de Niños Baobab', 40.1893885, -3.6812896, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170042', 'education', 'school', 'Escuela Infantil Privada Mamatina', 40.4494617, -3.7820985, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170043', 'education', 'school', 'Projardin Retiro-1', 40.4156031, -3.6721875, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170049', 'education', 'school', 'Escuela Infantil-casa de Niños San Miguel', 40.4743223, -3.6524378, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170050', 'education', 'school', 'Escuela Infantil-casa de Niños Daniel Vázquez Díaz', 40.464846, -3.7133221, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170053', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Cev Centro de Estudios del Vídeo', 40.4373652, -3.7154613, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170056', 'education', 'school', 'El Bosque Encantado', 40.3971462, -3.9139601, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170057', 'education', 'school', 'Mamani', 40.4066005, -3.877159, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170058', 'education', 'school', 'Escuela Infantil Privada Catalina Laboure', 40.4083963, -3.6484277, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170060', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Fundación Tomillo', 40.3659466, -3.6980419, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170061', 'education', 'high_school', 'Colegio de Educación Infantil, Primaria y Secundaria Serracines', 40.6211874, -3.3977221, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170062', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica La Milagrosa', 40.3159513, -3.8735444, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170063', 'education', 'school', 'British Nursery', 40.4367117, -3.7936968, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170064', 'education', 'school', 'Escuela Infantil Privada A.e.i.o.u.', 40.3924948, -3.7531664, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170067', 'education', 'school', 'Escuela Infantil Privada Maberogan Pinar', 40.4817847, -3.7296887, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170068', 'education', 'school', 'Escuela Infantil Privada Nemomarlin Majadahonda Delta', 40.4703901, -3.881014, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170072', 'education', 'school', 'Escuela Infantil Privada Abetitos And Children', 40.4940472, -3.3819513, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170073', 'education', 'school', 'Escuela Infantil Privada Projardin Delicias', 40.3986548, -3.6940308, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170075', 'education', 'school', 'Escuela infantil boreal', 40.4624361, -3.6247751, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170076', 'education', 'school', 'Azul', 40.5010206, -4.0709892, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170080', 'education', 'school', 'La Rana Glotona', 40.4676909, -3.6613936, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170081', 'education', 'school', 'Escuela Infantil-casa de Niños Quijorna', 40.4261497, -4.0573421, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170084', 'education', 'school', 'Mamá Oca (cerrada)', 40.6782774, -3.6196135, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170085', 'education', 'school', 'Escuela Infantil Privada Santa Isabel', 40.5433189, -3.6353863, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170089', 'education', 'high_school', 'Ceu II-Instituto Superior de Estudios Profesionales', 40.3879747, -3.7455367, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170091', 'education', 'school', 'Escuela Infantil Privada Cascabel', 40.480735, -3.6686778, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170093', 'education', 'school', 'Esc.Superior de Informática de Las Rozas', 40.4897592, -3.8754362, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170111', 'education', 'school', 'Los Locos Bajitos', 40.4303389, -3.7078484, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170113', 'education', 'school', 'Escuela Infantil Privada La Marioneta', 40.6332996, -3.5121882, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170122', 'education', 'school', 'Colegio de Educación Infantil y Primaria San Miguel', 40.7474601, -3.6001303, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170161', 'education', 'school', 'Escuela Infantil Privada El Nido', 40.2549599, -3.8262927, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170180', 'education', 'school', 'Escuela Infantil Privada Los Delfines II', 40.4531595, -3.4738712, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170197', 'education', 'school', 'Colegio de Educación Especial Monte Abantos', 40.5208223, -3.9017726, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170202', 'education', 'school', 'Colegio de Educación Infantil y Primaria Rayuela', 40.4916839, -3.9619909, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170222', 'education', 'school', 'Hontanar', 40.4650068, -3.6753289, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170242', 'education', 'school', 'Zona Casas de Niños Oeste-4, Robledo de Chavela', 40.4976594, -4.2397781, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170246', 'education', 'school', 'Escuela Infantil-casa de Niños El Vellón', 40.768089, -3.5798383, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170249', 'education', 'school', 'Escuela Infantil-casa de Niños La Estación', 40.2971094, -4.1120759, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170252', 'education', 'school', 'Escuela Infantil Privada Montessori Village Alcalá', 40.4772729, -3.3680065, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170263', 'education', 'school', 'Escuela Infantil Tobogán II', 40.3925324, -3.7087972, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170279', 'education', 'school', 'Escuela Infantil-casa de Niños Pasemisi', 40.2330907, -3.9925448, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170283', 'education', 'school', 'La Golondrina', 40.3725223, -3.7515873, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170286', 'education', 'school', 'C.E.I. Nuestra Señora de la Consolación', 40.4641632, -3.6511918, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170290', 'education', 'school', 'Projardin Praga', 40.3938477, -3.7069254, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170294', 'education', 'school', 'Escuela Infantil Privada Mi Primer Cole 3', 40.4298487, -3.6512033, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170299', 'education', 'school', 'Escuela Infantil Privada San Gabriel Arcángel', 40.464997, -3.7232206, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170302', 'education', 'school', 'Caracol', 40.4246555, -3.6295809, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170307', 'education', 'school', 'Centro Privado de Educación Infantil Grimm', 40.6456634, -4.0369993, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170311', 'education', 'school', 'Don Pitufo', 40.4368901, -3.7968149, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170319', 'education', 'school', 'Escuela Infantil-casa de Niños El Duende', 40.2866989, -3.7494341, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170322', 'education', 'school', 'Escuela Infantil Privada Arco Iris Infantil', 40.6608837, -3.7734184, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170325', 'education', 'school', 'Escuela Infantil Privada Alicia', 40.4279565, -3.7189135, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170329', 'education', 'school', 'Imagen', 40.4042521, -3.678356, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170332', 'education', 'school', 'Escuela Infantil Kinder My Garden', 40.4648187, -3.589333, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170342', 'education', 'school', 'Escuela Infantil Privada Don Miki', 40.2882863, -3.8024806, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170347', 'education', 'school', 'Dumbo', 40.2994368, -3.8085845, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170351', 'education', 'school', 'Centro de Educación Infantil Reina Cristina II', 40.5083893, -3.354221, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170355', 'education', 'school', 'Centro de Estudios Turísticos Ábaco', 40.4222168, -3.7141346, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170358', 'education', 'school', 'Diversión y Talento Divertium', 40.4591858, -3.6583736, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170364', 'education', 'school', 'Escuela Infantil Privada Mi Casita', 40.3303303, -3.7534247, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170367', 'education', 'school', 'Escuela Infantil Privada Garabatos y Ocho Patos', 40.4021171, -3.7040003, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170371', 'education', 'school', 'Escuela Infantil Privada Casa Menuda', 40.5456791, -3.6290337, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170378', 'education', 'school', 'Escuela Infantil Privada Primeros Pasos', 40.3844877, -3.6466674, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170381', 'education', 'school', 'Escuela Infantil Privada Jaizkibel', 40.439799, -3.6455296, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170389', 'education', 'school', 'Escuela Infantil Privada Margal', 40.40047, -3.6609085, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170393', 'education', 'school', 'Mamen', 40.6780569, -3.6211389, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170400', 'education', 'school', 'Escuela Infantil-casa de Niños Baobab', 40.5005418, -3.258026, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170410', 'education', 'school', 'Centro Público de Educación de Personas Adultas Buitrago de Lozoya', 40.9938475, -3.6360234, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170420', 'education', 'school', 'Centro Público de Educación de Personas Adultas La Oreja Verde', 40.5828127, -4.0091883, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170423', 'education', 'school', 'Centro Público de Educación de Personas Adultas Almajan', 40.5760049, -3.9284604, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170435', 'education', 'school', 'Centro Público de Educación de Personas Adultas La Mesta', 40.4465799, -4.0068586, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170439', 'education', 'school', 'Centro Privado de Educación Infantil Las Gaviotas', 40.4520747, -3.5851062, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170444', 'education', 'school', 'Escuela Infantil Privada Grazalema', 40.3735027, -3.6183284, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170452', 'education', 'school', 'Centro de estudios Acua', 40.4277342, -3.698531, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170464', 'education', 'high_school', 'Instituto de Educación Secundaria Sabino Fernández Campo', 40.5010347, -4.2363105, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170475', 'education', 'school', 'Escuela Infantil Privada JardIImar', 40.4062047, -3.7190684, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170487', 'education', 'school', 'Escuela Infantil Privada Puzzle', 40.4643982, -3.4585104, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170490', 'education', 'school', 'Centro de Estudios Avanzados Alta Dirección', 40.4274365, -3.6579215, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170494', 'education', 'school', 'Peques', 40.4975982, -3.9697563, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170510', 'education', 'school', 'Escuela Infantil Privada Pelonchines', 40.2871958, -3.7574648, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170517', 'education', 'school', 'Escuela Infantil Las Ardillas', 40.5805062, -3.9310721, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170529', 'education', 'school', 'Escuela Infantil Privada Los Ángeles', 40.3777965, -3.734527, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170539', 'education', 'school', 'Escuela Infantil Privada Casal', 40.3073365, -3.7370255, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170543', 'education', 'school', 'Escuela Infantil Privada Nene''s', 40.3282607, -3.8680978, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170546', 'education', 'school', 'Escuela Infantil Privada Pequeño Príncipe', 40.333687, -3.8684413, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170553', 'education', 'school', 'Los Niños Gori Gori', 40.4053316, -3.9962912, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170556', 'education', 'school', 'Caramelos', 40.6212644, -4.0058842, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170559', 'education', 'school', 'Baloo El Oso', 40.607354, -4.0535937, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170562', 'education', 'school', 'Escuela Infantil Privada El Camino', 40.408637, -3.6993859, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170563', 'education', 'school', 'Escuela Infantil Privada Guiñol', 40.4079196, -3.6356474, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170566', 'education', 'school', 'Escuela Infantil Privada El Pinar', 40.481261, -3.6721657, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170568', 'education', 'school', 'Escuela Infantil Privada El Arrullo I', 40.3707452, -3.6204808, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170570', 'education', 'school', 'Escuela Infantil Privada Blancanitos 2', 40.3989543, -3.7070783, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170571', 'education', 'school', 'Escuela Infantil Privada Todo Para la Infancia', 40.4562353, -3.7136992, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170573', 'education', 'high_school', 'Colegio de Educación Infantil, Primaria y Secundaria El Encinar', 40.5705493, -3.9268662, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170575', 'education', 'school', 'Centro Privado de Educación Infantil Globos', 40.4108453, -3.6562048, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170576', 'education', 'school', 'Escuela Infantil Privada Nuestra Señora de las Victorias', 40.4642146, -3.7000713, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170578', 'education', 'school', 'Pituco', 40.2322688, -3.7751891, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170582', 'education', 'school', 'Amiguitos', 40.3341381, -3.861113, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170583', 'education', 'school', 'Madre Y Reina', 40.4324423, -3.8139894, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170585', 'education', 'school', 'Nuevo Liceo', 40.3526999, -3.7012642, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170589', 'education', 'school', 'Escuela Infantil Privada Nemomarlin la Vaguada', 40.4823617, -3.7104998, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170590', 'education', 'school', 'Pispajos', 40.4642037, -3.6399908, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170594', 'education', 'school', 'Carrusel', 40.297319, -3.803382, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170595', 'education', 'school', 'Escuela Infantil Privada Pequeñeces', 40.4374922, -3.8116243, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170596', 'education', 'school', 'Escuela Infantil Privada Pecas', 40.4379602, -3.8081354, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170597', 'education', 'school', 'Escuela Infantil Privada Tete', 40.5763725, -3.9268474, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170598', 'education', 'school', 'Zona Casas de Niños Norte-8, Talamanca de Jarama', 40.7457844, -3.5150767, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170601', 'education', 'school', 'Centro Privado de Educación Especial Hospital Infantil San Rafael', 40.452279, -3.6817504, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170602', 'education', 'school', 'Zona Casas de Niños Capital-3, San Miguel', 40.4743669, -3.6522945, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170603', 'education', 'school', 'Zona Casas de Niños Oeste-3, Guadarrama', 40.6687311, -4.0872817, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170609', 'education', 'school', 'Zona Casas de Niños Sur-7, Parla', 40.2291246, -3.7732849, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170617', 'education', 'school', 'Escuela Infantil Los Olivos', 40.1847692, -3.6818793, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170621', 'education', 'school', 'Escuela Infantil-casa de Niños Pilocha', 40.2290245, -3.7722957, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170625', 'education', 'school', 'Escuela Infantil Los Almendros', 40.4486453, -3.3593076, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170626', 'education', 'school', 'Casa de niños de Villamantilla - La Jara', 40.3434927, -4.1279912, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170627', 'education', 'school', 'Escuela Infantil Casa de Niños', 40.3474122, -4.1023415, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170628', 'education', 'school', 'Escuela Infantil-casa de Niños Sol y Luna', 40.3418089, -3.8246142, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170629', 'education', 'school', 'Lomas II', 40.4481287, -3.7932226, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170630', 'education', 'school', 'Projardin Aluche', 40.3880342, -3.7613129, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170631', 'education', 'school', 'Escuela Infantil Privada Mininanos', 40.4584229, -3.6993855, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170633', 'education', 'school', 'Projardin Igueldo', 40.3403083, -3.8177244, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170635', 'education', 'school', 'Armonía', 40.4510118, -3.6112649, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170636', 'education', 'school', 'Escuela Infantil Privada Lunalu', 40.4020431, -3.6465362, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170637', 'education', 'school', 'Escuela Infantil Privada Guireli II', 40.4573111, -3.4764128, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170639', 'education', 'school', 'La Casita de Doña Tortuga, S.L.L.', 40.4277569, -3.6270401, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170644', 'education', 'school', 'Escuela Infantil El Duende', 40.4267611, -3.7046693, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170646', 'education', 'school', 'Escuela Infantil Santa Cecilia', 40.7372615, -3.5796768, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170649', 'education', 'school', 'Escuela Infantil-casa de Niños El Árbol', 40.1693369, -3.2802737, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170650', 'education', 'school', 'Escuela Infantil-casa de Niños La Colmena', 40.1134248, -3.3924824, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170651', 'education', 'school', 'Centro Público de Educación de Personas Adultas Las Rosas', 40.421243, -3.6237972, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170652', 'education', 'school', 'Zona Casas de Niños Este-9, Torres de la Alameda', 40.4041578, -3.3606427, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170653', 'education', 'school', 'Escuela Infantil Privada Mi Casita', 40.4408203, -3.8014562, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170655', 'education', 'school', 'Escuela Infantil Privada Cantitos', 40.5953331, -3.7013628, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170656', 'education', 'school', 'Escuela Infantil Privada Nuestra Señora de la Encarnación', 40.3928594, -3.7118408, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170658', 'education', 'school', 'Escuela Infantil Privada Arlequín', 40.4186879, -3.8399701, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170659', 'education', 'school', 'Escuela Infantil Privada Osobuco II', 40.4507028, -3.6672534, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170660', 'education', 'school', 'Guireli I', 40.4562206, -3.4783088, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170661', 'education', 'school', 'Mamani', 40.4059749, -3.8766512, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170665', 'education', 'school', 'Escuela Infantil Ruiz Jiménez', 40.4350879, -3.6723929, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170667', 'education', 'school', 'Aula Hospitalaria Ramón y Cajal', 40.4872706, -3.6946719, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170669', 'education', 'school', 'Aula Hospitalaria Severo Ochoa', 40.3205581, -3.769442, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170670', 'education', 'school', 'Aula Hospitalaria Hospital General Móstoles', 40.3156611, -3.8776782, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170671', 'education', 'school', 'Aula Hospitalaria Hospital Universitario de Getafe', 40.3125974, -3.7413075, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170672', 'education', 'school', 'Aula Hospitalaria Fundación Alcorcón', 40.3496135, -3.8363318, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170673', 'education', 'school', 'Centro Privado de Educación Especial Pauta', 40.4269241, -3.6183793, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170682', 'education', 'school', 'Aula Hospitalaria Pradera de San Isidro', 40.3961695, -3.7276224, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170683', 'education', 'school', 'Aula Hospitalaria Doce de Octubre', 40.3764036, -3.6969245, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170689', 'education', 'school', 'Escuela Infantil Privada El Duende', 40.7340233, -3.9469811, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170690', 'education', 'school', 'Escuela Infantil Privada La Casita de Alejandra', 40.6328157, -4.016919, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170693', 'education', 'school', 'Escuela Infantil-casa de Niños El Hada Traga Manzanas', 40.6252853, -3.9999464, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170695', 'education', 'school', 'Escuela Infantil Privada Paides', 40.4405323, -3.7942694, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170706', 'education', 'school', 'Escuela Infantil Privada Garabatos', 40.4770064, -3.7231015, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170708', 'education', 'school', 'Escuela Infantil La Gatita Curiosa', 40.2854918, -3.8088794, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170710', 'education', 'school', 'Escuela Infantil Privada Bambis', 40.377829, -3.6205114, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170712', 'education', 'school', 'Escuela Infantil Don Melitón', 40.4407571, -3.6151811, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170717', 'education', 'school', 'Escuela Infantil Privada Colorines', 40.1541951, -3.6242758, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170719', 'education', 'school', 'Escuela Infantil Privada La Casita de la Abuela', 40.6006615, -3.7095143, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170723', 'education', 'school', 'Escuela Infantil Privada Kchetas de Colores', 40.1887863, -3.6810487, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170726', 'education', 'school', 'Escuela Infantil Micare', 40.548405, -3.3275748, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170727', 'education', 'school', 'Escuela Infantil Privada Aldeas Infantiles S.o.s. de España', 40.6002705, -4.1409658, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170728', 'education', 'school', 'Escolandia II', 40.5002277, -3.6911447, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170729', 'education', 'school', 'Centro de Estudios Empresariales Complutense (Ceeco)', 40.5320082, -3.4263946, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170731', 'education', 'school', 'Escuela Infantil-casa de Niños Luna Lunera', 40.27482, -3.9171066, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170733', 'education', 'school', 'Escuela Infantil Dulcinea', 40.3314823, -3.7528198, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170737', 'education', 'school', 'Escuela Infantil Privada La Luna', 40.3847527, -3.6107459, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170738', 'education', 'school', 'Colorín', 40.3865397, -3.7515176, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170739', 'education', 'school', 'Escuela Infantil Privada Alegre Koala', 40.3995673, -3.707014, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170740', 'education', 'school', 'Centro Privado de Educación Infantil Arco Iris', 40.6354462, -4.0165217, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170741', 'education', 'school', 'Chupetín', 40.4047952, -3.9989466, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170742', 'education', 'school', 'Escuela Infantil Privada Bambi y Tambor', 40.4090215, -3.6624619, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170743', 'education', 'school', 'Escuela Infantil Privada Pipo''s', 40.3994561, -3.7001076, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170744', 'education', 'school', 'Escuela Infantil Privada Carrusel', 40.4477399, -3.6670826, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170747', 'education', 'school', 'Escuela Infantil Privada Chuly', 40.3994285, -3.7061406, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170748', 'education', 'school', 'Escuela Infantil Privada Bélgica', 40.2857302, -3.804335, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170749', 'education', 'school', 'Escuela Infantil Privada Bamby', 40.393154, -3.780455, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170750', 'education', 'school', 'Escuela Infantil Privada Ozito Panda', 40.4070034, -3.6319819, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170751', 'education', 'school', 'Don Pelanas', 40.4450466, -3.8011816, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170753', 'education', 'school', 'El Trébol Mágico', 40.3657766, -3.6532677, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170754', 'education', 'school', 'El Jardín de Arroyo', 40.2653568, -3.9172433, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170757', 'education', 'school', 'Tete', 40.3562347, -3.8102032, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170758', 'education', 'school', 'Escuela Infantil Privada La Vuelta Al Sol By Montessori', 40.5571121, -3.3262866, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170760', 'education', 'school', 'Nubes', 40.3845456, -3.7085571, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170762', 'education', 'school', 'Escuela Infantil Privada La Virgen Niña', 40.449814, -3.6493964, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170763', 'education', 'school', 'Minimundo', 40.3445954, -3.7505372, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170768', 'education', 'school', 'Escuela Infantil Privada Kiddy Lane School', 40.5494828, -3.6562556, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170777', 'education', 'school', 'Escuela Infantil Privada Suecia Garden', 40.4224696, -3.6082723, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170780', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Gsd el Escorial', 40.5857487, -4.0460818, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170781', 'education', 'school', 'Escuela Infantil Privada Toscana Garden', 40.4183522, -3.6134814, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170782', 'education', 'school', 'Babalu-Las Rozas', 40.5442013, -3.8984585, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170784', 'education', 'school', 'Babalu-Boadilla', 40.4087289, -3.8953393, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170785', 'education', 'school', 'Colorín Colorado', 40.6412278, -4.0272926, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170786', 'education', 'school', 'La Cigüeña', 40.4653397, -3.4626454, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170787', 'education', 'school', 'Escuela Infantil Privada Los Pingüinetes', 40.3424935, -3.7456761, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170789', 'education', 'school', 'Escuela Infantil Privada La Gran Familia', 40.4936228, -3.3742022, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170790', 'education', 'school', 'Escuela Infantil Privada Educando Pitufos', 40.4116422, -3.6747646, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170791', 'education', 'school', 'Patucos', 40.5951457, -3.4995339, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170793', 'education', 'school', 'Escuela Infantil Privada El Bosque de Pulgarcito', 40.6575737, -4.0277678, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170796', 'education', 'school', 'VíaFormación', 40.4277773, -3.7009655, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170797', 'education', 'school', 'La Jirafa', 40.4083308, -3.7355499, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170798', 'education', 'school', 'Escuela Infantil Privada La Abeja Maya', 40.4778641, -3.7228039, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170799', 'education', 'school', 'Escuela Infantil Privada La Guarde del Huerto', 40.4790187, -3.6457304, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170800', 'education', 'school', 'Escuela Infantil Privada Caracol', 40.1842106, -3.6824243, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170802', 'education', 'school', 'Vicente Aleixandre', 40.4303866, -3.7186888, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170803', 'education', 'school', 'Centro Privado de Educación de Personas Adultas Centro Bobath de Educación de Adultos', 40.4907501, -3.7201053, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170804', 'education', 'school', 'Pequeñines', 40.4875378, -3.9641134, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170805', 'education', 'school', 'Rechuflas', 40.3809573, -3.6576719, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170806', 'education', 'school', 'Escuela Infantil Privada El Tren de los Niños II', 40.4784805, -3.6749873, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170808', 'education', 'school', 'Colegio de Educación Infantil y Primaria San Miguel', 40.4704131, -4.1239274, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170810', 'education', 'school', 'Colegio de Educación Infantil y Primaria Príncipes de Asturias', 40.430616, -4.0573546, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170811', 'education', 'high_school', 'Centro Privado de Educación Secundaria Santa Ana', 40.4606143, -3.6741176, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170812', 'education', 'school', 'Escuela Infantil Privada Escuela Infantil Bilingüe Sus Pequeños Pasos-arturo Soria', 40.4625773, -3.660801, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170813', 'education', 'school', 'Escuela Infantil Privada Pequeño Sócrates', 40.3450737, -3.5229919, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170814', 'education', 'school', 'San Miguel III', 40.6201381, -4.1177402, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170816', 'education', 'school', 'Escuela Infantil Privada Trazos', 40.4215586, -3.6673903, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170817', 'education', 'school', 'El Nido De Los Negrales', 40.6406548, -4.0289276, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170819', 'education', 'school', 'Vickie', 40.3900369, -3.6674984, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170821', 'education', 'school', 'Escuela Infantil Privada Nuestra Señora de la Providencia', 40.4464047, -3.6451602, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170822', 'education', 'school', 'El Principito', 40.4506457, -3.4690285, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170825', 'education', 'school', 'La Jirafa Azul', 40.6933922, -3.5132741, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170827', 'education', 'school', 'Montessori Alcalá de Henares', 40.5336826, -3.4291563, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170831', 'education', 'school', 'Escuela Infantil El Delfin Don Mulder', 40.4502246, -3.6828383, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170836', 'education', 'school', 'Escuela Infantil Cangurito', 40.2780948, -3.8005331, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170839', 'education', 'school', 'Escuela Infantil Privada A Gatas', 40.7543454, -3.7835318, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170841', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria La Purísima', 40.4273387, -3.6578179, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170844', 'education', 'school', 'Antiguo Centro de E.E. Aleph', 40.4505522, -3.642912, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170846', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Instituto Vox', 40.4219683, -3.7091222, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170854', 'education', 'school', 'Colegio de Educación Infantil y Primaria Pedro Brimonis', 40.2532944, -3.8245574, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170859', 'education', 'school', 'Escuela Infantil Privada Lagartijas', 40.556955, -3.6410447, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170862', 'education', 'school', 'Escuela Infantil Privada Asociados Kym', 40.4490366, -3.352705, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170868', 'education', 'school', 'Centro de Estudios Delicias', 40.4055933, -3.6937054, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170870', 'education', 'school', 'Liceo Rosales II', 40.3493873, -3.6892459, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170873', 'education', 'school', 'Escuela Infantil Privada Diventium', 40.3784518, -3.7470222, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170883', 'education', 'school', 'Escuela Infantil Privada Caracol 2000', 40.4389257, -3.6156597, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170886', 'education', 'school', 'Puzzle', 40.4632972, -3.6428302, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170890', 'education', 'school', 'Escuela Infantil Privada Domo', 40.4718021, -3.6480687, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170892', 'education', 'school', 'Papi', 40.3698991, -3.4854485, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170895', 'education', 'school', 'Marce', 40.383018, -3.7694349, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170898', 'education', 'school', 'Escuela Infantil Privada Mafalda', 40.4318731, -3.7013013, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170901', 'education', 'school', 'Escuela Infantil Privada Santa María', 40.4351013, -3.6495207, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170907', 'education', 'school', 'Escuela Infantil Privada Sandy', 40.4693976, -3.6527403, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170909', 'education', 'school', 'Escuela Infantil Privada Woody', 40.3933423, -3.7568952, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170912', 'education', 'school', 'Escuela Infantil Privada Hipopótamo Blas', 40.5976214, -3.7028285, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170915', 'education', 'school', 'Escuela Infantil Duendecillos Let´s Play!', 40.4178971, -3.61955, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170918', 'education', 'school', 'Los Peques', 40.2794181, -3.7980386, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170928', 'education', 'school', 'Escuela Infantil Privada Sueños de Papel', 40.5516418, -3.6390927, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170930', 'education', 'school', 'Escuela Infantil Privada Little Lions', 40.4096848, -3.881005, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170934', 'education', 'school', 'Centro Privado de Educación Infantil Micos, Mi Primer Cole', 40.4469484, -3.686897, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170944', 'education', 'high_school', 'Colegio de Educación Infantil, Primaria y Secundaria El Cantizal', 40.5203961, -3.9216026, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170954', 'education', 'school', 'Colegio de Educación Infantil y Primaria La Garena', 40.4831181, -3.3878582, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170958', 'education', 'school', 'Monigote', 40.7466453, -3.7825502, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170961', 'education', 'school', 'Centro Privado de Educación Especial Centro Bobath España', 40.4907898, -3.7199685, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170963', 'education', 'school', 'Escuela Infantil Privada Los Peces', 40.5477749, -3.379291, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170979', 'education', 'school', 'Escuela Infantil Privada Geminis', 40.4898221, -3.7046901, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170985', 'education', 'school', 'Los 3 Ositos', 40.5939971, -3.7018098, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170987', 'education', 'school', 'El Arrullo II', 40.3769736, -3.6185789, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170990', 'education', 'school', 'Centro Privado de Educación Infantil Colores', 40.5561817, -3.9042014, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170992', 'education', 'school', 'San Cristóbal', 40.6611792, -4.0436153, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266170999', 'education', 'school', 'Colegio de Educación Infantil y Primaria Ágora', 40.4081901, -3.9955294, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171014', 'education', 'school', 'Colegio de Educación Infantil y Primaria Bachiller Alonso López', 40.5531839, -3.6560009, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171017', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Mataespesa', 40.6599896, -4.0368392, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171019', 'education', 'school', 'Centro Estímulos', 40.4547309, -3.6153115, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171021', 'education', 'school', 'Escuela Infantil Privada El Rey de la Casa', 40.39266, -3.7647988, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171027', 'education', 'school', 'Escuela Infantil Privada Montessori II', 40.3398599, -3.8275267, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171031', 'education', 'school', 'Arlequín', 40.5939886, -3.5004708, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171037', 'education', 'school', 'Escuela Infantil Privada El Chovo', 40.3898517, -3.6619644, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171043', 'education', 'school', 'Pequeño/A Compañero/A', 40.3466444, -3.7094484, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171049', 'education', 'school', 'El Parque', 40.4707614, -3.642169, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171052', 'education', 'school', 'Escuela Infantil Privada Cinco Estrellas', 40.4401981, -3.6152586, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171054', 'education', 'school', 'Los Duendes', 40.2879271, -3.7982843, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171056', 'education', 'school', 'Escuela Infantil Privada Minimos y Diminutos', 40.3988045, -3.7608216, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171061', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Cesur-madrid', 40.4443713, -3.6724917, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171064', 'education', 'school', 'Caperucita', 40.4651336, -3.7229861, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171067', 'education', 'school', 'Escuela Infantil Privada María Montessori I', 40.3397634, -3.8259591, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171069', 'education', 'school', 'Escuela Infantil Luna', 40.2764479, -3.7919559, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171072', 'education', 'school', 'Centro Privado de Educación Infantil Jauja', 40.4802808, -3.8690085, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171074', 'education', 'school', 'El Arrullo III', 40.3768166, -3.6191522, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171076', 'education', 'school', 'Escuela de Educación Infantil Peter Pan', 40.2318758, -3.7656708, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171079', 'education', 'school', 'Andarines II', 40.3102949, -3.4469375, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171081', 'education', 'school', 'Escuela Infantil Privada Arco Iris', 40.4079016, -3.6531017, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171090', 'education', 'school', 'Blancanieves', 40.2388155, -3.7734415, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171094', 'education', 'school', 'Disney', 40.403605, -3.6311068, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171100', 'education', 'school', 'El Paraíso de Mamá', 40.636062, -3.5140636, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171105', 'education', 'school', 'Yolanda', 40.4448235, -3.4593104, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171108', 'education', 'school', 'Cuentos', 40.6516331, -4.0502795, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171112', 'education', 'school', 'Escuela Infantil Privada Tic-tac', 40.5047811, -3.5297154, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171115', 'education', 'school', 'Escuela Infantil Privada Cascabel', 40.5613127, -3.6300183, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171119', 'education', 'school', 'Radio Ecca', 40.427113, -3.6974625, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171124', 'education', 'school', 'Centro Privado de Educación de Personas Adultas Escuela Popular de Prosperidad', 40.4420363, -3.6760244, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171127', 'education', 'school', 'Asociación Semilla', 40.3437863, -3.7125901, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171132', 'education', 'school', 'Escuela Infantil Privada La Jirafa', 40.4635656, -3.6371502, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171135', 'education', 'school', 'Escuela Infantil Privada Cangurito', 40.4451115, -3.6413412, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171137', 'education', 'school', 'Dumbo', 40.4739708, -3.6355024, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171140', 'education', 'school', 'Casa marcos', 40.4075478, -3.7102564, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171143', 'education', 'school', 'El Desván', 40.3938707, -3.664914, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171144', 'education', 'school', 'Escuela Infantil Privada Cosquillas II', 40.3883121, -3.6933444, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171146', 'education', 'school', 'Escuela Infantil Privada Tanuca', 40.4283283, -3.6094213, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171147', 'education', 'school', 'Escuela Infantil Privada Monkey Banana', 40.3471065, -3.7143155, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171148', 'education', 'school', 'Margaritas Happy School', 40.4936471, -3.9660887, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171150', 'education', 'school', 'Escuela Infantil Privada Lagartijas II', 40.5531203, -3.6388823, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171151', 'education', 'school', 'Centro Privado de Educación Infantil Jarque', 40.1554957, -3.6303345, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171152', 'education', 'school', 'Escuela Infantil Privada La Casita Verde', 40.6734561, -3.7799018, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171153', 'education', 'school', 'Escuela Infantil Colores', 40.2896251, -3.7905046, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171154', 'education', 'school', 'Escuela Infantil Privada Nanos', 40.4749813, -3.7181442, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171155', 'education', 'school', 'Picolos', 40.3930287, -3.7580228, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171156', 'education', 'school', 'Centro Público de Educación de Personas Adultas San Sebastián de los Reyes', 40.5542881, -3.6326777, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171157', 'education', 'school', 'Centro Público de Educación de Personas Adultas Sierra de Guadarrama', 40.6932477, -4.0243805, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171162', 'education', 'school', 'Escuela Infantil Casa de Niños Siete Estrellas', 40.22848, -3.111844, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171166', 'education', 'school', 'Escuela Infantil-casa de Niños El Principito', 40.1840422, -3.7768371, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171171', 'education', 'school', 'Escuela Infantil Privada Crios', 40.4874142, -3.8813071, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171172', 'education', 'school', 'Infancia y Empresa Kidsco El Plantío', 40.4732354, -3.8325206, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171173', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Escuela Europea Ayudantes de Dirección', 40.4324967, -3.6736978, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171174', 'education', 'school', 'Gente Pequeña', 40.5448312, -3.6423582, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171180', 'education', 'school', 'Escuela Infantil Privada Yaki', 40.4524932, -3.6707735, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171181', 'education', 'school', 'Escuela Infantil Privada Reina Cristina III', 40.5092421, -3.3540989, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171182', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Colegio Nuestra Señora de Schoenstatt', 40.4326252, -3.8141525, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171183', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Centro de Humanización de la Salud', 40.6158368, -3.7145569, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171184', 'education', 'school', 'Escuela Superior de Informática, Márketing y Negocios I&M', 40.4407041, -3.6825417, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171185', 'education', 'school', 'Escuela Infantil Privada Fantasy School', 40.4920586, -3.3644184, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171186', 'education', 'school', 'Antigua E.S.I.', 40.4319569, -3.6575662, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171189', 'education', 'school', 'Escuela Infantil Privada Garabato', 40.3318349, -3.8710457, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171190', 'education', 'school', 'Triángulo', 40.5545472, -3.8936704, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171192', 'education', 'school', 'Escuela Infantil Privada El Chalet', 40.2064268, -3.8792493, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171194', 'education', 'school', 'Escuela Infantil Privada La Guardería', 40.5584789, -3.6391575, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171195', 'education', 'school', 'Escuela Infantil Privada Nemomarlin Rivas', 40.3643936, -3.544011, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171197', 'education', 'school', 'Escuela Infantil Privada Denenes', 40.30465, -3.7313156, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171198', 'education', 'school', 'Escuela Infantil Privada Heidi Garabatos II', 40.3026222, -3.7287511, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171199', 'education', 'school', 'Escuela Infantil La Flauta Mágica', 40.4985476, -3.369267, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171200', 'education', 'school', 'Escuela Infantil El Nogal', 40.657318, -4.0218436, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171201', 'education', 'school', 'Centro Privado de Educación Especial Aucavi', 40.4272719, -3.6579278, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171203', 'education', 'school', 'Escuela Infantil Privada El Mundo de Mozart I', 40.444438, -3.5773757, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171204', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Malvar', 40.3076483, -3.4464141, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171214', 'education', 'school', 'Escuela Infantil Privada Kokoro', 40.489498, -3.9645544, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171215', 'education', 'school', 'Escuela Infantil Privada Colorines', 40.356641, -3.6858569, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171217', 'education', 'school', 'Escuela Infantil Privada San Jorge', 40.4472736, -3.6460411, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171218', 'education', 'school', 'Colegio de Educación Infantil y Primaria Clara Campoamor', 40.653471, -4.0190467, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171220', 'education', 'school', 'Escuela Infantil Privada Ñecos', 40.4277265, -3.6445697, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171222', 'education', 'school', 'Centro Docente Extranjero En España Montessori School los Fresnos-mataespesa (britanico)', 40.6596672, -4.036404, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171225', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Timón', 40.4244025, -3.6104407, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171228', 'education', 'school', 'St. Michael''s Royal School', 40.620174, -4.1177271, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171229', 'education', 'school', 'Escuela Infantil Privada Pequeñilandia', 40.3498025, -3.6992705, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171230', 'education', 'school', 'Escuela Infantil Privada Jauja', 40.4873492, -3.9683583, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171231', 'education', 'school', 'Escuela Infantil El Bosque', 40.24828, -3.8293979, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171232', 'education', 'school', 'Escuela Infantil Cascabeles', 40.5511861, -3.6517444, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171235', 'education', 'school', 'La Morera', 40.248923, -3.8264076, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171236', 'education', 'school', 'Centro Docente Extranjero En España King''s Infant School (britanico)', 40.4649618, -3.6691398, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171237', 'education', 'school', 'Colegio de Educación Infantil y Primaria Francisco Tomás y Valiente', 40.3750688, -3.484325, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171241', 'education', 'school', 'Colegio de Educación Infantil y Primaria Los Santos', 40.5066386, -3.2507789, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171245', 'education', 'school', 'Colegio de Educación Infantil y Primaria Los Lagos', 40.247134, -3.7709395, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171248', 'education', 'school', 'Colegio de Educación Infantil y Primaria Ana María Matute', 40.3281327, -3.7228121, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171251', 'education', 'high_school', 'Colegio de Educación Infantil, Primaria y Secundaria Sansueña', 40.7474648, -3.5150367, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171253', 'education', 'school', 'Colegio de Educación Infantil y Primaria Río Alberche', 40.3632019, -4.3293827, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171258', 'education', 'school', 'Colegio de Educación Infantil y Primaria Jonathan Galea', 40.6147174, -3.5369405, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171259', 'education', 'school', 'Colegio de Educación Infantil y Primaria Santa Ana', 40.7470319, -3.6004263, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171260', 'education', 'school', 'Colegio de Educación Infantil y Primaria Arco de la Sierra', 40.7404404, -3.581165, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171263', 'education', 'school', 'Centro de Enseñanzas Superiores de Diseño de Interiores de Madrid', 40.4387272, -3.6739855, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171269', 'education', 'school', 'Centro Autorizado de Enseñanzas Deportivas Grado Medio y Superior Ciudad del Fútbol', 40.5227496, -3.8995593, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171272', 'education', 'school', 'Colegio de Educación Infantil y Primaria Carpe Diem', 40.4985748, -3.9656173, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171276', 'education', 'school', 'Escuela Infantil Privada Peques', 40.4344341, -3.6183305, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171279', 'education', 'school', 'Arco Iris', 40.674278, -3.6135078, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171280', 'education', 'school', 'Escuela Infantil Privada María Auxiliadora', 40.3593359, -3.6941951, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171282', 'education', 'school', 'Escuela Infantil Base Aerea de Torrejón', 40.473582, -3.4484599, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171283', 'education', 'school', 'Escuela Infantil Privada Tito Gusanito', 40.5422815, -3.6407752, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171284', 'education', 'school', 'Camarmitos', 40.5606869, -3.3724896, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171285', 'education', 'school', 'Murialdo', 40.4228015, -3.6153715, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171286', 'education', 'school', 'Escuela Infantil Privada Tobogan II', 40.3926953, -3.7088712, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171287', 'education', 'school', 'Centro Privado de Educación Infantil Pekes', 40.3793535, -3.618452, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171288', 'education', 'school', 'Escuela Infantil Privada Kinderin', 40.3733774, -3.7584861, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171289', 'education', 'school', 'Escuela Infantil Privada Little Jungle', 40.4025679, -3.608506, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171292', 'education', 'school', 'Pelocho', 40.5114099, -3.6692699, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171295', 'education', 'school', 'Escuela Infantil Privada Tres Cantos', 40.5887653, -3.7088453, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171296', 'education', 'school', 'Escuela Infantil Privada Los Solecitos', 40.3863796, -3.7203105, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171298', 'education', 'school', 'Escuela Infantil Privada El Jardín de los Peluches', 40.7438916, -3.6020882, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171299', 'education', 'school', 'Escuela Infantil Privada Kiduu', 40.4433851, -3.7854477, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171300', 'education', 'school', 'Escuela Infantil Privada Gente Pequeña', 40.5417496, -3.6424706, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171301', 'education', 'school', 'Garbancito', 40.6287988, -3.4745044, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171302', 'education', 'school', 'Escuela Infantil Privada Mamá Queca II', 40.4665863, -3.6530867, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171303', 'education', 'school', 'Escuela Infantil Privada El Mundo de los Niños', 40.6299074, -4.0225822, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171307', 'education', 'school', 'Escuela Infantil Privada El Valle S.l.l.', 40.3125682, -3.4508243, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171309', 'education', 'school', 'Escuela Infantil Privada Ms Kids', 40.3929208, -3.691757, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171311', 'education', 'school', 'Escuela Infantil Privada Pocas Púas', 40.7432057, -3.6063464, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171313', 'education', 'school', 'Escuela Infantil Privada El Osito 2', 40.4451898, -3.6667062, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171314', 'education', 'school', 'Bambi', 40.4234626, -3.6010089, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171315', 'education', 'school', 'Escuela Infantil Privada Nemomarlin Butarque', 40.3475755, -3.6771178, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171317', 'education', 'school', 'Centro de Formación Comercial de Repsol YPF', 40.4333387, -3.6852449, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171318', 'education', 'school', 'Letras', 40.4309928, -3.6701712, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171319', 'education', 'school', 'San Miguel', 40.4042335, -3.7500524, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171320', 'education', 'school', 'Escuela Infantil Meraki', 40.4829539, -3.3933088, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171321', 'education', 'school', 'Escuela Infantil Privada Quita y Pon', 40.4499918, -3.6992039, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171323', 'education', 'school', 'Escuela Infantil Privada La Casita del Farol', 40.5623176, -3.8870736, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171324', 'education', 'school', 'Escuela Infantil Privada Los Pitufos', 40.3601984, -3.6972505, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171325', 'education', 'school', 'Jesusito de mi Vida', 40.4413667, -3.7131223, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171326', 'education', 'school', 'Pichirilo', 40.5334828, -3.4782407, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171327', 'education', 'school', 'Escuela Infantil Privada Luna Lunera', 40.3613576, -3.7560316, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171329', 'education', 'school', 'Tesorines', 40.4040606, -3.8972254, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171330', 'education', 'school', 'Escuela Infantil-casa de Niños Valdelaguna', 40.1588044, -3.3706324, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171331', 'education', 'school', 'Escuela Infantil-casa de Niños Valdepiélagos', 40.7592092, -3.4645286, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171332', 'education', 'school', 'Aula Hospitalaria de Fuenlabrada', 40.2864555, -3.8151531, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171333', 'education', 'school', 'Cinco Lobitos', 40.3428339, -3.750931, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171334', 'education', 'school', 'La Rana Feliz', 40.6063693, -3.7144917, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171336', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica San Roman Escuela de Estudios Superiores', 40.4303726, -3.6723617, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171338', 'education', 'school', 'Escuela Infantil Privada Mi Pequeño Mundo', 40.5463115, -3.4600119, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171339', 'education', 'school', 'Escuela Infantil Privada Los Retoños', 40.4050101, -3.7497663, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171342', 'education', 'school', 'Escuela Infantil Privada Sueños Con Alas', 40.4433643, -3.4617573, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171345', 'education', 'high_school', 'CEU III-Instituto Superior de Estudios Profesionales', 40.3722982, -3.749899, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171348', 'education', 'school', 'Escuela Infantil Privada Las Travesuras de Marieta', 40.444191, -3.812375, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171349', 'education', 'school', 'Escuela Infantil Privada Cucutras', 40.4642322, -3.6371683, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171351', 'education', 'school', 'Ronte', 40.3896072, -3.7268096, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171352', 'education', 'school', 'Escuela Infantil Privada Merlin', 40.4049975, -3.6040943, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171354', 'education', 'school', 'Escuela Infantil Privada El Duende Azul', 40.369818, -3.6192131, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171355', 'education', 'school', 'Escuela Infantil Privada Ciudad Financiera Sch', 40.3933388, -3.8557504, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171356', 'education', 'school', 'Los Soletes', 40.4724389, -3.587795, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171357', 'education', 'school', 'Escuela Infantil Privada Dina Condado', 40.480859, -3.6688838, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171358', 'education', 'school', 'Escuela Infantil Privada Dina Condado-2', 40.480735, -3.6690211, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171359', 'education', 'school', 'Escuela Infantil Privada Cocolan Cve', 40.4020032, -3.7089005, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171362', 'education', 'school', 'Escuela Infantil Privada Chiqui', 40.4337608, -3.7076543, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171363', 'education', 'school', 'Escuela Infantil Privada Sagrados Corazones', 40.4553872, -3.6963585, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171365', 'education', 'school', 'La Casa de Papel', 40.4395991, -3.647477, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171366', 'education', 'school', 'Escuela Infantil Acuarela', 40.4145175, -3.5217166, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171367', 'education', 'school', 'Escuela Infantil Privada Alcalde de Móstoles', 40.3273927, -3.8596031, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171375', 'education', 'school', 'La Cenicienta', 40.3794109, -3.6571268, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171376', 'education', 'school', 'Fantasía', 40.3819713, -3.7069136, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171377', 'education', 'school', 'Escuela Infantil Privada El Sol', 40.3336975, -3.7648643, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171381', 'education', 'school', 'Garabatos y Ocho Patos', 40.4014798, -3.710425, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171383', 'education', 'school', 'El Elefante', 40.4700076, -3.6626642, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171384', 'education', 'school', 'Escuela Infantil Privada Little Witch', 40.4714182, -3.6762436, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171385', 'education', 'school', 'Escuela Infantil El Bosque', 40.4038674, -3.6916096, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171386', 'education', 'school', 'Escuela Infantil Tarabilla', 40.4236371, -3.6348979, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171387', 'education', 'school', 'Escuela Infantil Risitas', 40.4456958, -3.6869668, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171389', 'education', 'school', 'Maravillas', 40.5941298, -4.1480881, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171391', 'education', 'school', 'Escuela Infantil Privada Los Pitus', 40.4059319, -3.886034, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171424', 'education', 'school', 'Escuela Infantil Privada La Cometa', 40.4728358, -3.8749537, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171443', 'education', 'school', 'La Guarde II', 40.4878939, -3.6614787, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171458', 'education', 'school', 'Escuela Infantil Privada Dos Hermanas', 40.178376, -3.6849147, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171485', 'education', 'school', 'Escuela Infantil Privada El Pequeño Sol', 40.3762459, -3.7651946, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171502', 'education', 'school', 'Escuela Infantil Privada Los Renacuajos', 40.4774333, -3.7001241, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171503', 'education', 'school', 'Escuela Infantil-casa de Niños Valdeolmos', 40.6382338, -3.4534978, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171506', 'education', 'school', 'Centro Privado de Educación Infantil Eduqa la Moraleja', 40.5280968, -3.6442515, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171508', 'education', 'school', 'Luna', 40.4447011, -3.4595089, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171509', 'education', 'school', 'Escuela Infantil Privada Kind For Kids', 40.4437266, -3.6547116, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171510', 'education', 'school', 'Fundación F. San Román', 40.5205957, -3.9077466, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171511', 'education', 'school', 'Escuela Infantil Privada Los Mofletes', 40.3487128, -3.8267157, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171512', 'education', 'school', 'Zona Casas de Niños Este-10, Tielmes', 40.2473044, -3.3139328, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171514', 'education', 'school', 'Zona Casas de Niños Norte-10, Valdeolmos-alalpardo', 40.6366526, -3.4546933, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171516', 'education', 'school', 'Escuela Infantil-casa de Niños Los Duendes', 40.6660021, -3.3932078, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171519', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Nuestra Señora de la Merced', 40.6131777, -3.7204076, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171522', 'education', 'school', 'Globos, S.L.', 40.4879116, -3.9461018, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171523', 'education', 'school', 'Escuela Infantil Privada Albéniz 2', 40.3872757, -3.7519263, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171524', 'education', 'school', 'Escuela Infantil Privada Kika', 40.3907752, -3.6873822, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171526', 'education', 'school', 'Virgen De La Encina', 40.6259306, -4.0101828, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171528', 'education', 'school', 'Trastitos', 40.5110913, -3.6780108, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171532', 'education', 'school', 'Escuela Infantil Privada Jardín Kinderland', 40.4553281, -3.6926902, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171535', 'education', 'school', 'Los Peques', 40.4565617, -3.7086234, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171537', 'education', 'school', 'Escuela Infantil Privada Muñecos', 40.4021456, -3.5997562, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171539', 'education', 'school', 'Rabel', 40.467823, -3.6318535, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171543', 'education', 'school', 'Diversión y Talento Diventium II', 40.3781256, -3.7459113, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171544', 'education', 'school', 'Escuela Infantil Privada Sus Pequeños Pasos', 40.5301752, -3.6318004, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171545', 'education', 'school', 'Escuela Infantil Privada Kaire-mi Cole', 40.4407398, -3.6528999, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171547', 'education', 'school', 'Escuela Infantil Privada Alternia', 40.3039066, -3.4365072, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171548', 'education', 'school', 'Pequeño Príncipe', 40.3303599, -3.7670859, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171549', 'education', 'school', 'Escuela De Bebes', 40.4425832, -3.7904627, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171550', 'education', 'school', 'Escuela Infantil Privada Zazuar I', 40.3786839, -3.6087863, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171551', 'education', 'school', 'Escuela Infantil Privada Zazuar II', 40.3794922, -3.6058367, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171552', 'education', 'school', 'El Abeto', 40.4415026, -3.6156006, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171553', 'education', 'school', 'Escuela Infantil El Arrullo V', 40.4060454, -3.624982, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171554', 'education', 'school', 'Jardilin', 40.4025319, -3.7540401, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171556', 'education', 'school', 'Escuela Infantil Privada Infancia y Empresa Kidsco Azca', 40.4506452, -3.6939158, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171558', 'education', 'school', 'Escuela Infantil Privada El Parque', 40.4441461, -3.6700776, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171559', 'education', 'school', 'Riomar', 40.4353149, -3.6627039, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171560', 'education', 'school', 'Escuela Infantil Privada Garly Infantil', 40.8143837, -3.7565293, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171561', 'education', 'school', 'Escuela Infantil Privada Nacer Centro', 40.3035316, -3.7272324, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171562', 'education', 'school', 'Escuela Infantil Privada Mi Cole', 40.4915261, -3.3628349, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171572', 'education', 'school', 'La Zarzuela', 40.4641614, -3.4507244, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171575', 'education', 'school', 'Escuela Infantil Privada La Oca Loca', 40.6130896, -3.7115724, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171576', 'education', 'school', 'Escuela de Educación Infantil Guardia Real', 40.5211517, -3.7783201, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171577', 'education', 'school', 'Centro Privado De Educación Infantil Fantasya', 40.2956014, -3.8329265, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171581', 'education', 'school', 'Escuela Infantil Privada La Casa del Río - Miriam', 40.4293218, -3.7347693, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171583', 'education', 'school', 'Burbujas', 40.4884668, -3.7068234, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171584', 'education', 'school', 'Escuela Infantil Privada Mi Primer Cole 4', 40.4665198, -3.6372724, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171585', 'education', 'school', 'Escuela Infantil Privada Bebines', 40.2953846, -3.7394096, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171586', 'education', 'school', 'Escuela Infantil Privada La Casa de los Hermanitos', 40.3613252, -3.6965232, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171587', 'education', 'school', 'Pequeñas Promesas', 40.4423843, -3.4734732, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171589', 'education', 'school', 'Escuela Infantil Privada Educamundo', 40.4923373, -3.8639903, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171591', 'education', 'school', 'Escuela Infantil Privada La Casita de Caramelo', 40.2975167, -3.8034549, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171592', 'education', 'school', 'Escuela Infantil Privada Pambola', 40.438985, -4.0082331, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171595', 'education', 'school', 'Escuela Infantil Privada Pippo', 40.4421288, -3.6710971, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171596', 'education', 'school', 'Los Nogales', 40.5964449, -3.7037144, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171597', 'education', 'school', 'La Ballena', 40.245849, -3.7681769, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171598', 'education', 'school', 'Escuela Infantil Privada Infantil Peques', 40.3453917, -3.7132631, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171600', 'education', 'school', 'Escuela Infantil Privada Parque de Lisboa', 40.3517869, -3.8240749, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171602', 'education', 'school', 'Epi II', 40.4006819, -3.700898, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171604', 'education', 'school', 'Escuela Infantil Privada Juguetones', 40.3818184, -3.6709098, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171605', 'education', 'school', 'Escuela Infantil Privada Happy School', 40.4758832, -3.7016108, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171606', 'education', 'school', 'Escuela Infantil Albéniz', 40.3744925, -3.7724217, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171611', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Colegio Miramadrid', 40.5050258, -3.5194377, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171614', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Educrea el Mirador', 40.4326219, -3.290509, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171616', 'education', 'school', 'Escuela Infantil Privada Risitas', 40.3326705, -3.7518548, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171617', 'education', 'school', 'Pompitas', 40.2517623, -3.8230499, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171618', 'education', 'school', 'Escuela Infantil Privada Pequesol', 40.3568543, -3.7769143, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171620', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Colegio Arula', 40.626827, -3.4722523, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171623', 'education', 'school', 'Escuela Infantil Privada El Bosque Encantado', 40.3825062, -3.6963276, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171624', 'education', 'school', 'Ludocucos', 40.4196559, -3.5722327, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171625', 'education', 'school', 'Escuela Infantil Privada Luna Limón Escuela Infantil Hospital de Fuenlabrada', 40.2863007, -3.8154759, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171628', 'education', 'school', 'Escuela Infantil Privada Luna Lunera', 40.653734, -3.7819188, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171630', 'education', 'school', 'Extensión EOI de Alcalá de Henares en Arganda del Rey', 40.2957646, -3.4320869, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171631', 'education', 'school', 'Centro Cepal 2', 40.4475668, -3.6728483, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171635', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Colegio Ártica', 40.3605286, -3.755932, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171636', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Gsd Alcalá', 40.5039702, -3.3635378, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171639', 'education', 'school', 'Escuela Infantil-casa de Niños Valdemaqueda', 40.5128877, -4.2985192, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171640', 'education', 'school', 'Centro Privado de Educación de Personas Adultas Cica', 40.3905206, -3.7145374, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171641', 'education', 'school', 'Escuela Infantil Congreso de los Diputados', 40.4162497, -3.6984191, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171643', 'education', 'school', 'Pingüinos', 40.5253729, -3.9199589, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171644', 'education', 'school', 'Colegio de Educación Infantil y Primaria San Vicente', 40.4186977, -4.1998939, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171647', 'education', 'school', 'Cuatro Pecas', 40.4119884, -3.7176095, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171649', 'education', 'school', 'Escuela Infantil La Brisa', 40.4729069, -3.6991477, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171650', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Nuestra Señora de la Concepción', 40.3026735, -4.0060206, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171652', 'education', 'school', 'Escuela Infantil El Corro de la Patata', 40.3524426, -3.8150366, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171656', 'education', 'school', 'Centro Privado de Educación de Personas Adultas Centro Politecnico A Distancia y Editorial Cpd, S.l.', 40.4869888, -3.6983624, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171657', 'education', 'school', 'Escuela Infantil Privada Mi Pequeña Granja', 40.4548461, -3.7957349, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171662', 'education', 'school', 'Colegio de Educación Infantil y Primaria Vicente Ferrer', 40.3204329, -3.7376227, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171666', 'education', 'school', 'Escuela Infantil Privada San Miguel II', 40.4011841, -3.7480729, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171672', 'education', 'school', 'Escuela Infantil Privada Fantasía II', 40.3820566, -3.7095525, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171677', 'education', 'school', 'Wonderland', 40.3165961, -3.7345399, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171678', 'education', 'school', 'Escuela Infantil Privada El Cuentacuentos', 40.238253, -3.7788232, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171680', 'education', 'school', 'Duendes', 40.4907917, -3.8813984, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171681', 'education', 'school', 'Dulce Regazo', 40.349774, -3.824658, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171682', 'education', 'school', 'Eglantina', 40.5442172, -4.1091335, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171683', 'education', 'school', 'Escuela Infantil Privada Babystar', 40.5849309, -4.0004196, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171685', 'education', 'school', 'Escuela Infantil Privada Topitos', 40.6360145, -4.0034091, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171686', 'education', 'school', 'Escuela Infantil Privada Moma Nature Montessori', 40.5869526, -3.9547777, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171687', 'education', 'school', 'Escuela Infantil Privada Nanos Doctor Vallejo', 40.4358773, -3.6430586, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171688', 'education', 'school', 'Escuela Infantil Privada Iris', 40.4609467, -3.6440982, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171689', 'education', 'school', 'Koala Garden', 40.3226993, -4.1991461, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171690', 'education', 'school', 'Escuela Infantil Privada La Casita Encantada', 40.2082697, -3.5791093, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171691', 'education', 'school', 'Escuela Infantil Privada Los Castillos', 40.2637861, -3.9130709, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171692', 'education', 'school', 'Escuela Infantil Privada Los Cucos', 40.4596102, -3.5807014, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171693', 'education', 'school', 'Luna Mágica', 40.4017378, -3.7459003, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171694', 'education', 'school', 'Escuela Infantil Grumete Madrid', 40.4714286, -3.6669107, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171695', 'education', 'school', 'Sanchinarro', 40.4863988, -3.6557978, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171699', 'education', 'school', 'Escuela Infantil Privada Asociados Kym', 40.4768274, -3.3700183, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171700', 'education', 'school', 'Escuela Infantil Privada Tiny Tots', 40.4529202, -3.620009, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171701', 'education', 'school', 'Escuela Infantil Privada Benjamines', 40.4424043, -3.6518883, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171702', 'education', 'school', 'Escuela Infantil Privada Baloo Arganzuela', 40.3877953, -3.6926809, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171703', 'education', 'school', 'Escuela Infantil Privada Pequeñecos Parque Norte', 40.4759862, -3.671889, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171704', 'education', 'school', 'Burbujas Atp', 40.4079603, -3.9015665, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171706', 'education', 'school', 'Escuela Infantil Privada Kids Retiro', 40.4034167, -3.6702054, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171708', 'education', 'school', 'Colorín', 40.449019, -3.6480625, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171709', 'education', 'school', 'Escuela Infantil Privada Chamberines', 40.4368726, -3.7017626, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171710', 'education', 'school', 'Escuela Infantil Privada Smiles Bilingual Nursey School', 40.5019403, -3.6772718, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171711', 'education', 'school', 'Escuela Infantil Privada My Little Peas', 40.3879579, -3.7297845, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171712', 'education', 'school', 'Escuela Infantil Privada Ranitas', 40.7159987, -3.9018082, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171719', 'education', 'school', 'Escuela Infantil Privada Sonrisas', 40.3220824, -3.7557595, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171752', 'education', 'school', 'Escuela Infantil Trapitos: Guardería en Villaverde', 40.3432635, -3.6750143, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171753', 'education', 'school', 'Tris Tras', 40.4496704, -3.7951079, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171754', 'education', 'school', 'Escuela Infantil Privada Tania Jardín', 40.3882735, -3.6574955, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171756', 'education', 'school', 'Tartarugas', 40.2476098, -3.7671236, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171757', 'education', 'school', 'Escuela Infantil Privada El Bebé', 40.4800356, -3.7313451, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171758', 'education', 'school', 'Mi Cole', 40.3356943, -3.8128068, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171759', 'education', 'school', 'Escuela Infantil Privada Velilla', 40.368685, -3.4822092, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171760', 'education', 'school', 'Escuela Infantil Privada Villanueva Renacuajos', 40.4470559, -3.9977907, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171765', 'education', 'school', 'Escuela Infantil Privada Nayer Kids', 40.3637095, -3.764056, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171768', 'education', 'school', 'Escuela Infantil Privada Monigotes', 40.3251848, -3.7522033, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171769', 'education', 'school', 'Monigotes, S.L.', 40.5994862, -3.5011514, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171770', 'education', 'school', 'Escuela Infantil Privada Pablo Gonzalez', 40.3693767, -3.4849908, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171771', 'education', 'school', 'En un Lugar de Chamberí', 40.4326855, -3.7017994, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171772', 'education', 'school', 'Escuela Infantil Privada Nubes II', 40.398361, -3.7185845, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171773', 'education', 'school', 'Nervión', 40.4465348, -3.6836107, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171774', 'education', 'school', 'Pequeñeces 2', 40.4584733, -3.480773, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171775', 'education', 'school', 'Pequeña Tripulación', 40.2711643, -3.917651, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171779', 'education', 'school', 'Pizpiretadas', 40.4067787, -3.9010444, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171780', 'education', 'school', 'Escuela Infantil Privada Pituco II', 40.2351353, -3.7789885, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171782', 'education', 'school', 'Pim Pam', 40.449946, -3.4718299, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171788', 'education', 'school', 'El Parque Mágico', 40.4586931, -3.4517249, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171789', 'education', 'school', 'Centro Regional de Enseñanzas Integradas Sagrado Corazón de Jesús', 40.3795348, -3.7396951, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171790', 'education', 'school', 'Quecas', 40.2405514, -3.7597192, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171792', 'education', 'school', 'Escuela Infantil Veo-veo', 40.444125, -3.6554106, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171794', 'education', 'school', 'Escuela Infantil Trebole', 40.2890491, -4.0207829, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171795', 'education', 'school', 'Escuela Infantil Privada Chiqui Tin Pinar de Chamartín', 40.4816788, -3.6619659, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171799', 'education', 'school', 'Escuela Infantil Las Flores', 40.3549727, -3.8031947, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171800', 'education', 'school', 'Escuela Infantil Privada Chiqui Tin Alcobendas', 40.5346171, -3.6252579, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171801', 'education', 'school', 'Escuela Infantil Privada Zazuar III', 40.3833842, -3.6058008, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171802', 'education', 'school', 'Asociación MASI (Monitores de Apoyo Social a la Infancia)', 40.3972323, -3.7392194, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171804', 'education', 'school', 'Escuela Infantil Cuartel General del Ejército del Aire', 40.4328433, -3.719555, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171805', 'education', 'school', 'Escuela Infantil Cabo Idoia Rodríguez Bujan', 40.699456, -3.7632576, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171806', 'education', 'school', 'Antigua Escuela Infantil del Parque y Centro de Abastecimiento de Material de Intendencia', 40.3920894, -3.7733646, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171807', 'education', 'school', 'Escuela Infantil Privada Nubbe', 40.5017821, -3.6899078, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171808', 'education', 'school', 'Escuela Infantil Privada Pippiu', 40.6168717, -4.009993, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171811', 'education', 'school', 'Escuela Infantil Privada Peques', 40.3779189, -3.6188513, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171813', 'education', 'school', 'Soletes', 40.1816174, -3.6936659, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171814', 'education', 'school', 'Hogar Infantil', 40.3553985, -3.6904141, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171815', 'education', 'school', 'Escuela Infantil Privada Nemomarlin Carabanchel', 40.3622723, -3.766627, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171816', 'education', 'school', 'Escuela Infantil Privada El Parque de la Piovera', 40.4550265, -3.6151949, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171817', 'education', 'school', 'El Alboroto', 40.5134855, -3.6576405, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171818', 'education', 'school', 'Escuela Infantil Privada Topochitos', 40.4998713, -3.6752497, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171819', 'education', 'school', 'Escuela Infantil Privada Los Pequeñitos', 40.2864498, -4.0069214, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171820', 'education', 'school', 'El Paraíso de los Duendes', 40.5504736, -3.3804636, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171821', 'education', 'school', 'Escuela Infantil Privada Lapiceros', 40.4639151, -3.4762824, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171823', 'education', 'school', 'La Casita De Bunny', 40.3571075, -3.8116503, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171824', 'education', 'school', 'Unidad de Formación e Inserción Laboral Margarita Salas', 40.278127, -3.7906987, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171826', 'education', 'school', 'Escuela Infantil Privada Albéniz III', 40.275566, -3.9203921, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171827', 'education', 'school', 'Escuela Infantil Privada Chupetines', 40.3731624, -3.7471994, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171828', 'education', 'school', 'Escuela Infantil Privada San Marino', 40.4844898, -3.3897356, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171830', 'education', 'school', 'Escuela Infantil Privada La Escuelita', 40.4873893, -3.3458526, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171833', 'education', 'school', 'Escuela Infantil Privada Mascero', 40.4807911, -3.6331384, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171834', 'education', 'school', 'Escuela Infantil Tesoros', 40.3107374, -3.4443278, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171836', 'education', 'school', 'Escuela Infantil Osa Menor', 40.4279365, -3.699499, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171837', 'education', 'school', 'Escuela Infantil Pinceladas', 40.3137098, -3.4806304, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171838', 'education', 'school', 'Escuela Infantil Privada Piruetas', 40.2448023, -3.7760976, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171839', 'education', 'school', 'Sol y Luna School', 40.4627087, -3.6551172, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171841', 'education', 'school', 'ESERP Madrid Business School', 40.4587817, -3.6753648, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171842', 'education', 'school', 'Escuela Infantil Privada Adaluna', 40.4530426, -4.008646, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171843', 'education', 'school', 'Infancia y Empresa Kidsco Sanchinarro', 40.504439, -3.6499753, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171844', 'education', 'school', 'Escuela Infantil Juan Ramón Jiménez', 40.5198404, -3.9027032, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171845', 'education', 'school', 'Escuela Infantil Privada Donde Estan las Llaves', 40.3963299, -3.6911319, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171848', 'education', 'school', 'Escuela Infantil Privada Dina', 40.4079825, -3.737201, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171850', 'education', 'school', 'Cuzco', 40.5952451, -3.9616821, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171851', 'education', 'school', 'Upi y Mine', 40.4640557, -3.5870263, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171852', 'education', 'school', 'Escuela Infantil Paso A Pasito', 40.5043884, -3.5265102, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171854', 'education', 'school', 'Escuela Infantil Privada Mi Tata', 40.2746817, -3.9205683, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171855', 'education', 'school', 'Escuela Infantil Privada Soletes', 40.7455415, -3.7757671, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171857', 'education', 'school', 'Escuela Infantil Privada La Cigüeña', 40.3806417, -3.7140378, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171858', 'education', 'school', 'Escuela Infantil Privada Gazapitos', 40.4418422, -3.8170414, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171859', 'education', 'school', 'Escuela Infantil Privada Don Melitón II', 40.3653086, -3.7455111, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171860', 'education', 'school', 'Escuela Infantil Marta Mata', 40.3164115, -3.7339885, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171866', 'education', 'school', 'Escuela Infantil El Olivar', 40.3587338, -4.4005439, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171867', 'education', 'school', 'Escuela Madrileña Alta Montaña. Centro de Formación', 40.5245875, -3.6837403, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171868', 'education', 'school', 'Escuela Infantil Fábulas y Leyendas', 40.3161002, -3.8574794, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171869', 'education', 'school', 'Escuela Infantil Privada Pikabu', 40.238359, -3.7793596, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171871', 'education', 'school', 'El Jardín de las Hadas', 40.5733868, -3.9524184, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171872', 'education', 'school', 'Centro Privado de Educación Infantil Tres Colores', 40.6154134, -3.70279, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171873', 'education', 'school', 'Nueva Bambi', 40.3254909, -3.8705846, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171874', 'education', 'school', 'GoblinTrader Madrid Norte', 40.4456464, -3.7064174, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171875', 'education', 'school', 'Escuela Infantil Privada Osobuco', 40.4491366, -3.6654573, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171877', 'education', 'school', 'El Globo', 40.4689744, -3.3675603, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171878', 'education', 'school', 'Escuela Infantil Privada Chiqui Moratalaz', 40.4098265, -3.6537691, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171880', 'education', 'school', 'Epi I', 40.4007662, -3.7009696, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171881', 'education', 'school', 'Escuela Infantil Privada Dulce Limón', 40.4951408, -3.3781468, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171882', 'education', 'school', 'Escuela Infantil Privada Coco', 40.3826972, -3.7466684, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171883', 'education', 'school', 'Escuela Infantil Privada Los Alamos', 40.3603354, -3.5396107, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171886', 'education', 'school', 'Escuela Infantil Privada Muñecotes', 40.5588066, -3.6253411, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171895', 'education', 'school', 'Antigua academia Ntm Madrid', 40.4257837, -3.6843834, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171899', 'education', 'school', 'Escuela Infantil Privada Chiqui Tin Coslada', 40.4348326, -3.558255, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171905', 'education', 'school', 'Escuela Infantil Privada Vaiana', 40.4704066, -3.6920236, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171910', 'education', 'school', 'Escuela Infantil Privada Pequemun', 40.4444954, -3.7170701, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171912', 'education', 'school', 'Centro Privado de Educación Infantil Ascella', 40.4811255, -3.3661752, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171913', 'education', 'school', 'Escuela Infantil Privada Contumami-la Vaguada', 40.4779249, -3.7083469, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171914', 'education', 'high_school', 'Centro Privado de Formación Profesional Específica Centro Bobath de Formación Profesional', 40.4908145, -3.7198382, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171917', 'education', 'school', 'Escuela Infantil Privada Muchos Peques', 40.4139035, -3.8948119, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171921', 'education', 'school', 'Colegio de Educación Infantil y Primaria San Pedro Apóstol', 40.6686919, -3.3941245, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171924', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Villaverde', 40.3596196, -3.6865216, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171925', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Moratalaz-Villa de Vallecas', 40.4011544, -3.6419703, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171926', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Tetuán', 40.4709935, -3.6908463, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171927', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana San Blas', 40.4239468, -3.6126516, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171931', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Puente de Vallecas', 40.392878, -3.6383162, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171935', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Latina-Carabanchel-Centro', 40.3769192, -3.7367969, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171946', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Alcalá de Henares', 40.4860794, -3.3479066, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171950', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Móstoles', 40.3154193, -3.8618017, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171965', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Colmenar Viejo-Tres Cantos', 40.5995558, -3.7149865, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171969', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana la Cabrera-Lozoyuela', 40.864566, -3.6140581, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171972', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Alcobendas-San Sebastián de los Reyes', 40.5542384, -3.6325783, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171976', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Específico Deficiencias Motoricas', 40.4246789, -3.6130074, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171979', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Parla', 40.2418001, -3.7750758, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171980', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Específico Deficiencias Auditivas', 40.4245574, -3.612134, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171982', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atencion Temprana Villanueva de la Cañada', 40.4458892, -4.0041156, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171985', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana Torrelodones', 40.5745901, -3.9535411, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171987', 'education', 'school', 'C.A.P. de Collado Villalba', 40.6239777, -4.0148373, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171988', 'education', 'school', 'C.A.P. De San Lorenzo De El Escorial', 40.5960614, -4.1390017, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171989', 'education', 'school', 'C.A.P. de Colmenar Viejo', 40.6618376, -3.7620681, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171990', 'education', 'school', 'C.A.P. De La Cabrera', 40.8723948, -3.608802, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171992', 'education', 'school', 'C.A.P. de Villarejo de Salvanés', 40.167507, -3.274576, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266171997', 'education', 'school', 'Centro de Formación Ambiental Ciudad Escolar', 40.5237887, -3.6854296, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172000', 'education', 'school', 'Centro de Apoyo al Profesorado de San Martín de Valdeiglesias', 40.3633895, -4.3982511, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172005', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General San Sebastián de los Reyes', 40.5581828, -3.6241353, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172006', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General de las Rozas', 40.5269878, -3.9210273, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172008', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica Atención Temprana San Martín de Valdeiglesias', 40.3609145, -4.4030724, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172018', 'education', 'school', 'Escuela Infantil Privada Pasitos Magicos', 40.4022009, -3.6685664, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172021', 'education', 'school', 'Escuela Infantil Privada Ciudad Jardín', 40.456774, -3.6704858, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172024', 'education', 'school', 'Escuela Infantil Privada El Mundo de Mozart II', 40.4438406, -3.5779365, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172026', 'education', 'school', 'El Duende Jugueton', 40.3523578, -3.8093679, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172029', 'education', 'school', 'Escuela Infantil Privada Bolboreta', 40.3878201, -3.7429548, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172030', 'education', 'school', 'Molinillos', 40.4284428, -4.0538414, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172031', 'education', 'school', 'Escuela Infantil Privada El Globo', 40.5796284, -3.9349024, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172032', 'education', 'school', 'Escuela Infantil Privada De Rechupete', 40.5607206, -3.6212248, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172033', 'education', 'high_school', 'El Duende Travieso', 40.4033159, -3.7097474, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172038', 'education', 'school', 'Centro Privado de Educación Especial Gaudem', 40.4733241, -3.5939348, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172039', 'education', 'school', 'Escuela Infantil Privada Nuevo Cascabel', 40.4781904, -3.6653542, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172067', 'education', 'school', 'El Pichón', 40.2342895, -3.7488288, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172071', 'education', 'school', 'Escuela Infantil Privada Colorines Henares', 40.4903921, -3.3514026, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172075', 'education', 'school', 'C.A.P. De Alcobendas', 40.5440324, -3.6436895, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172078', 'education', 'school', 'C.A.P. de Alcalá de Henares', 40.4745772, -3.3667848, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172080', 'education', 'school', 'C.A.P. de Leganés', 40.3288846, -3.7570236, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172084', 'education', 'school', 'C.A.P. de Ciudad Lineal', 40.4291543, -3.6323355, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172086', 'education', 'school', 'C.A.P. De Coslada', 40.4270667, -3.5696019, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172087', 'education', 'school', 'Centro de apoyo al profesorado de Majadahonda', 40.4650943, -3.8677227, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172089', 'education', 'school', 'Centro de Apoyo al Profesorado de Madrid-Centro', 40.4280353, -3.7147403, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172093', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Tetuán-Fuencarral', 40.4944309, -3.6942669, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172095', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Latina', 40.3913501, -3.7510856, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172096', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Centro-Arganzuela', 40.4337612, -3.6898898, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172097', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Villaverde-Usera', 40.3674674, -3.7027923, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172098', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Carabanchel', 40.3807758, -3.7407247, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172100', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Puente Vallecas', 40.3935675, -3.6627403, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172101', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Hortaleza-Barajas', 40.4730484, -3.6347644, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172104', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Alcalá de Henares', 40.4862481, -3.3480709, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172106', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Rivas-Vaciamadrid', 40.3737046, -3.5279418, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172107', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Coslada', 40.4272246, -3.5696134, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172108', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Torrejón de Ardoz', 40.4558312, -3.4819588, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172109', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Aranjuez', 40.0291049, -3.6049915, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172112', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Leganés', 40.3290863, -3.7566472, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172114', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Parla', 40.2434091, -3.7661357, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172115', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General San Martín de Valdeiglesias', 40.3635779, -4.3981373, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172119', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Valdemorillo-El Escorial', 40.4458239, -4.0040642, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172120', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General Alcobendas', 40.5440682, -3.6436822, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172122', 'education', 'school', 'Equipo de Orientación Educativa y Psicopedagógica General la Cabrera', 40.8638645, -3.615523, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172123', 'education', 'school', 'Tic Tac 2', 40.505607, -3.5296403, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172141', 'education', 'school', 'Centro Privado de Educación Primaria San Miguel', 40.4307864, -3.9022602, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172142', 'education', 'school', 'Escuela Infantil Cadi, Centro de Atención y Desarrollo Infantil', 40.5057756, -3.7068429, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172144', 'education', 'school', 'Abc Kindergarten', 40.5196221, -3.6604861, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172148', 'education', 'school', 'Escuela Infantil Privada Cocholate', 40.4192613, -3.5415032, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172149', 'education', 'school', 'Escuela Infantil Privada Montemar', 40.5105563, -3.6964627, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172150', 'education', 'school', 'Escuela Infantil Bularas Inia', 40.4569156, -3.7502241, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172151', 'education', 'school', 'Escuela Infantil Privada Escuela Reggio Education 3c', 40.6010371, -3.7070245, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172152', 'education', 'school', 'Escuela Infantil Privada Blancanieves', 40.2777676, -3.8006299, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172153', 'education', 'school', 'Escuela Infantil Privada Inizia Distrito C', 40.5123053, -3.660804, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172154', 'education', 'school', 'Arco Iris', 40.4480937, -3.6079875, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172155', 'education', 'school', 'San Marcos', 40.4330671, -3.7126238, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172156', 'education', 'school', 'Risitas Tres', 40.4898278, -3.9584707, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172157', 'education', 'school', 'Escuela Infantil Privada Girasoles', 40.5057899, -3.5266908, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172159', 'education', 'school', 'Escuela Infantil Privada Pepito Grillo', 40.423639, -3.6014368, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172161', 'education', 'school', 'Infancia y Empresa Kidsco Valdemarín', 40.4655001, -3.7922629, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172162', 'education', 'school', 'Edificio', 40.4071729, -3.6047762, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172163', 'education', 'school', 'Lápices de colores', 40.4080493, -3.6377583, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172164', 'education', 'school', 'Centro Privado de Educación Infantil Los Nidos de Manoteras', 40.4880879, -3.6713952, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172165', 'education', 'school', 'Escuela Infantil Privada Pequesur', 40.3397782, -3.7463405, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172167', 'education', 'school', 'Escuela Infantil Privada El Reino del Revés', 40.3993478, -3.6995832, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172168', 'education', 'school', 'Escuela Infantil Privada Globitos', 40.4658874, -3.5882218, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172169', 'education', 'school', 'Escuela Infantil Privada Las Cuatro Estaciones', 40.6659946, -3.7789396, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172170', 'education', 'school', 'Pasito A Pasito', 40.6645425, -3.777858, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172171', 'education', 'school', 'Escuela Infantil Privada Pequedama', 40.4386871, -3.3148462, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172174', 'education', 'school', 'Escuela Infantil Privada Luna Lunera', 40.2859091, -4.0131364, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172176', 'education', 'school', 'Trébol', 40.3441736, -3.8268832, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172177', 'education', 'school', 'Enanitos', 40.308982, -3.9201389, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172178', 'education', 'school', 'Escuela Infantil Privada Pececitos Santa Teresa', 40.6667355, -3.7799537, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172179', 'education', 'school', 'Diciembre Garden', 40.4430987, -3.5697113, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172182', 'education', 'school', 'El Parque de Bubu', 40.3568177, -3.7852559, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172184', 'education', 'school', 'Escuela Infantil Privada Arco Iris', 40.5490669, -3.6436741, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172186', 'education', 'school', 'Escuela Infantil Privada Cocorico', 40.4410874, -3.6715946, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172187', 'education', 'school', 'Mamá Estoy Bien, menos mal', 40.1808393, -3.683643, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172188', 'education', 'school', 'Escuela Infantil Privada El Jardín de los Garabatos', 40.2421035, -3.7781293, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172189', 'education', 'school', 'Escuela Infantil Privada Estrella de Mar', 40.7404251, -3.5098898, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172190', 'education', 'school', 'Escuela Infantil Privada Kinder School', 40.3468266, -4.027987, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172192', 'education', 'school', 'Escuela Infantil Privada Vickie', 40.3909172, -3.6710008, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172193', 'education', 'school', 'Los Soletes Proyectos Infantiles, S.L. II', 40.3921849, -3.6803092, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172194', 'education', 'school', 'Escuela Infantil Privada Colors', 40.3579651, -3.6860568, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172196', 'education', 'high_school', 'Centro Privado de Educación Infantil, Primaria y Secundaria Colegio Gaudem', 40.4732644, -3.5937478, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172200', 'education', 'school', 'Centro Privado de Educación Especial A.p.s.a.', 40.3130387, -3.4526045, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172203', 'education', 'school', 'Pipolandia', 40.3988717, -3.7000052, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172209', 'education', 'school', 'Escuela Infantil Privada Pompitas', 40.3488336, -3.8298191, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172213', 'education', 'school', 'Escuela Infantil Privada Mi Primer Pasito', 40.2533473, -3.8234986, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172217', 'education', 'school', 'Escuela Infantil Privada Osobaby', 40.3120186, -3.9335841, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172218', 'education', 'school', 'Escuela Infantil Privada Primeros Pasos', 40.3516398, -3.8217705, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172221', 'education', 'school', 'Chiquitin Carabanchel II', 40.3721333, -3.7613698, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172222', 'education', 'school', 'Escuela Infantil Privada Chiqui Tin Alcántara', 40.4305534, -3.6735186, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172224', 'education', 'school', 'Escuela Infantil Privada Pequeña Gaia', 40.3412224, -3.6758888, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172226', 'education', 'school', 'Escuela Infantil Privada Sunny Baby', 40.4007796, -3.7450516, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172228', 'education', 'school', 'Escuela Infantil Privada Gatitos', 40.2943838, -3.8328133, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172230', 'education', 'school', 'Escuela Infantil Privada El Desván II', 40.3834028, -3.6533609, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172233', 'education', 'school', 'Escuela Infantil Privada El Globo Celeste', 40.3339736, -3.8611894, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172236', 'education', 'school', 'Escuela Infantil Cinco Lobitos', 40.3650318, -3.7556758, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172240', 'education', 'school', 'Escuela Infantil La Tarara', 40.4496815, -3.8660539, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172242', 'education', 'school', 'Escuela Infantil Caracol Col Col', 40.153264, -3.6303677, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172243', 'education', 'school', 'Escuela Infantil Juan Sin Miedo', 40.4625705, -3.4500223, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172244', 'education', 'school', 'Escuela Infantil Petirrojo', 40.2041425, -3.8017207, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172245', 'education', 'school', 'Escuela Infantil El Sastrecillo Valiente', 40.4021501, -3.3587723, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172246', 'education', 'school', 'Escuela Infantil Privada Patitos', 40.3557783, -3.7786204, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172247', 'education', 'school', 'Escuela Infantil Privada La Casita de Kika', 40.380716, -3.730482, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172248', 'education', 'school', 'Escuela Infantil Privada Los Madroños', 40.3486898, -3.6773357, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172250', 'education', 'school', 'Escuela Infantil Privada Sapo Sapito', 40.3084775, -3.7261056, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172251', 'education', 'school', 'Escuela Infantil Privada Mundo Mágico', 40.4267044, -3.5272414, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172254', 'education', 'school', 'Escuela Infantil El Almendro', 40.6727611, -3.7744427, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172255', 'education', 'school', 'El Barquito Chiquitito', 40.9622735, -3.7162412, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172260', 'education', 'school', 'Escuela Infantil El Naranjo', 40.246817, -3.7702097, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172267', 'education', 'school', 'Escuela Infantil El Limonero', 40.2303402, -3.7552627, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172269', 'education', 'school', 'Escuela Infantil Privada Chiquilandia', 40.5511243, -3.6338393, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172273', 'education', 'school', 'Escuela Infantil Privada Nuestra Señora de las Nieves', 40.4913511, -3.7051072, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172275', 'education', 'school', 'Master-D', 40.4286944, -3.701625, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172277', 'education', 'school', 'Escuela Infantil Privada El Patio', 40.2873213, -4.0126339, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172278', 'education', 'school', 'Escuela Infantil Privada Garabatos', 40.6665563, -3.7633396, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172279', 'education', 'school', 'Escuela Infantil Privada La Casita de Gus', 40.5498754, -3.6375878, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172280', 'education', 'school', 'Carambola', 40.1898283, -3.6754087, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172284', 'education', 'school', 'Escuela Infantil Privada Parque Odon', 40.3622167, -3.9113861, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172285', 'education', 'school', 'Escuela Infantil Privada Casita Maravillas', 40.3906894, -3.6908759, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_266172286', 'education', 'school', 'Cubo Pala', 40.4592246, -3.4553384, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_301831952', 'healthcare', 'primary_care', 'Centro de Salud Nuestra Señora de Fátima', 40.3793395, -3.7487595, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_338349891', 'transit', 'metro', 'El Bercial', 40.3292979, -3.7297609, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_390582269', 'education', 'high_school', 'Instituto Superior de Derecho y Economía', 40.4220517, -3.6906886, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_450926566', 'education', 'school', 'Acadomia', 40.4806212, -3.6670833, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_457010782', 'healthcare', 'primary_care', 'Centro Salud Potes', 40.3505462, -3.7099381, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_534902777', 'education', 'school', 'Colegio de Educación Infantil y Primaria C.r.a. Sierra Oeste Zarzalejo', 40.5470513, -4.1813748, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_534902778', 'education', 'school', 'Escuela Infantil-casa de Niños Colorín Colorete', 40.5475364, -4.1786524, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_587024368', 'education', 'school', 'Euroforum El Escorial', 40.5899483, -4.1438258, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_597375537', 'healthcare', 'hospital', 'Centro de especialidades Emigrantes', 40.4685882, -3.6364048, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_601650586', 'healthcare', 'primary_care', 'Centro de Salud de Barajas', 40.4716063, -3.5819254, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_616223396', 'healthcare', 'primary_care', 'Clínica Universal', 40.4329668, -3.6948081, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_616356313', 'healthcare', 'primary_care', 'Centro de Salud Adelfas', 40.400848, -3.6744662, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_619348724', 'healthcare', 'primary_care', 'Centro de Salud Ajalvir', 40.5365611, -3.4826779, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_770218121', 'transit', 'train', 'Estación Tres Cantos', 40.5989059, -3.715653, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_845762122', 'healthcare', 'primary_care', 'Centro Médico Las Tablas', 40.5069289, -3.6667094, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_845763449', 'transit', 'train', 'Estación El Goloso', 40.5584694, -3.7138301, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_852915804', 'healthcare', 'primary_care', 'Centro Médico Integral Henares', 40.4620264, -3.4576766, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_864623595', 'education', 'school', 'Escuela Infantil-casa de Niños Los Cascabeles', 40.3630305, -4.329796, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_878493654', 'healthcare', 'primary_care', 'Clínica Cellosa', 40.4545243, -3.4677036, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_903735671', 'healthcare', 'primary_care', 'Centro de Salud Argüelles', 40.427828, -3.7172212, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_903736802', 'healthcare', 'primary_care', 'Centro de Salud Guzmán el Bueno', 40.4312348, -3.7135908, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_937066557', 'healthcare', 'primary_care', 'Centro de Salud Las Cortes', 40.4164906, -3.6989912, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_959193176', 'healthcare', 'hospital', 'Centro de Especialidades', 40.4645362, -3.4728958, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_961875334', 'healthcare', 'primary_care', 'Consultorio de Pradena del Rincón', 41.0440129, -3.5415738, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_961875371', 'healthcare', 'primary_care', 'Consultorio Local de Horcajuelo de la Sierra', 41.0604991, -3.5462147, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_987471675', 'education', 'school', 'Escuela infantil Sonia', 40.5467993, -3.6376102, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_991417400', 'healthcare', 'primary_care', 'Centro de Salud', 40.8643577, -3.6144933, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_993530813', 'education', 'school', 'C.A.P. De La Cabrera', 40.8723948, -3.6088021, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1003549434', 'education', 'school', 'Goethe Institut', 40.4295617, -3.6913728, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1055046765', 'healthcare', 'primary_care', 'Centro de Salud Doctor Trueta', 40.3480977, -3.8290251, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1152895181', 'transit', 'train', 'Estación Villaverde Bajo', 40.352592, -3.6839811, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1255438243', 'education', 'school', 'Chiquitín Ajalvir', 40.5316155, -3.4829084, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1312910194', 'healthcare', 'primary_care', 'Consultorio Local El Escorial', 40.5858994, -4.133906, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1343025834', 'education', 'school', 'IberEnglish School of English', 40.4652857, -3.696557, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1379932622', 'education', 'school', 'Babilin II', 40.4054636, -3.7424152, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1471049725', 'education', 'school', 'Centro Privado de Educación Especial Virgen de Loreto Astor', 40.4529648, -3.4662738, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1502885315', 'healthcare', 'primary_care', 'Centro de Salud Bustarviejo', 40.4623282, -3.6953969, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1513666812', 'healthcare', 'primary_care', 'Centro Médico Estético Andrea Rodríguez', 40.4044832, -3.7545186, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1524567872', 'education', 'school', 'Parl@nchines', 40.2292159, -3.7564564, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1526712038', 'education', 'school', 'Escuela Infantil Mi Escuelita del Ensanche', 40.3620706, -3.5953069, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1534300862', 'education', 'school', 'CEPA (1)', 40.352392, -3.7010472, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1534461496', 'transit', 'train', 'Estación Las Águilas', 40.3814589, -3.7803772, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1539715402', 'education', 'school', 'CEPA (2)', 40.3524537, -3.7010225, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1541668790', 'education', 'school', 'Escuela Artabán', 40.5843255, -3.9637714, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1569187378', 'healthcare', 'primary_care', 'Ibermutuamur', 40.4537273, -3.4711554, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1603462617', 'education', 'school', 'Grupo de Escuelas de la Defensa', 40.3871106, -3.7473256, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1624468444', 'healthcare', 'primary_care', 'Centro de Salud El Molar', 40.737673, -3.5816094, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1643357984', 'education', 'school', 'Escuela de Pensamiento Matemático Miguel de Guzmán', 40.58142, -3.954219, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1655223219', 'education', 'school', 'Escuela Infantil-casa de Niños Marionetas', 40.4333679, -3.2995848, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1661261820', 'education', 'school', 'Centro Cultural Tamara Rojo', 40.4932916, -3.9635336, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1676188564', 'education', 'school', 'Colegio San Ignacio de Loyola', 40.5681604, -3.923273, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1719813582', 'education', 'school', 'Centro Superior de Estudios de la Defensa Nacional', 40.4399192, -3.6919965, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1759818425', 'education', 'school', 'El Girasol', 40.4438295, -3.6390801, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1766907720', 'healthcare', 'primary_care', 'Centro de Salud "Juncal"', 40.4641346, -3.4591123, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1816276898', 'education', 'school', 'Escuela de Adultos', 40.3682722, -3.4887107, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1818259604', 'education', 'high_school', 'Instituto de Enseñanza Secundaria Ana María Matute', 40.3714069, -3.4835422, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1825028439', 'healthcare', 'primary_care', 'Pediatría Atención Medica', 40.3686377, -3.4839588, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1832396651', 'healthcare', 'primary_care', 'Clínica Médica Los Belgas', 40.6282382, -4.0048338, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1846711264', 'healthcare', 'primary_care', 'Centro médico Paidos', 40.5771052, -4.0070593, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1851271036', 'healthcare', 'primary_care', 'Clínica Madrid', 40.2894448, -3.7917932, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1854019599', 'education', 'school', 'Escuela Infantil Puffi', 40.287827, -3.7936554, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1877642116', 'park', 'urban_park', 'Parque de la Arganzuela', 40.3975231, -3.709052, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1884638256', 'healthcare', 'primary_care', 'Policlínico HMM Torrelodones', 40.5694818, -3.9265632, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1888352008', 'education', 'school', 'Mundo Chiquininos', 40.2799328, -3.7919475, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1888352965', 'healthcare', 'primary_care', 'Clínica Erfisur', 40.280693, -3.7980533, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1895124371', 'education', 'school', 'Inventadero', 40.4351966, -3.71675, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1916847306', 'healthcare', 'primary_care', 'Ortopedia Fuenlabrada', 40.2848179, -3.7940464, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1921687452', 'healthcare', 'primary_care', 'Adeslas', 40.2841764, -3.7952653, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1922313835', 'education', 'school', 'Guardería El Abeto', 40.2879555, -3.7950385, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1922637398', 'healthcare', 'primary_care', 'Clínica González & Campos', 40.4661693, -3.6905628, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1928744225', 'education', 'school', 'Academia Vega', 40.3123696, -3.8562968, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1947229180', 'healthcare', 'primary_care', 'Centro de Salud Isla de Oza', 40.4679316, -3.7267958, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1947229219', 'education', 'school', 'Escuela Infantil Margot', 40.469191, -3.7168004, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_1996921750', 'transit', 'metro', 'Coslada Central', 40.4238571, -3.5619617, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2024882001', 'healthcare', 'primary_care', 'Seguros de Salud Salus', 40.4839772, -3.3683128, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2027033239', 'healthcare', 'primary_care', 'Toco-Gyn,S.L.', 40.4833281, -3.395168, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2027040214', 'education', 'school', 'Cuatro 43', 40.4836485, -3.395972, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2027166025', 'education', 'school', 'Centro de formación conforsa', 40.4791279, -3.3689122, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2027166029', 'education', 'school', 'Colegio Convento de mercedarios descalzos de la visitación de nuestra señora', 40.4783304, -3.3672227, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2030066370', 'education', 'school', 'Colegio de Educación Infantil y Primaria Peñas Albas', 40.4485004, -3.3598182, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2035308768', 'healthcare', 'hospital', 'Centro de salud primaria El Zulema', 40.4491236, -3.3759529, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2052587253', 'education', 'school', 'Colegio Los Nogales', 40.234411, -3.9985506, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2092341608', 'transit', 'train', 'Estación Colmenar Viejo', 40.6452011, -3.7765636, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2100673944', 'education', 'school', 'English Connection', 40.3618592, -3.7520783, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2108080570', 'education', 'school', 'Piolín', 40.4270676, -3.5352222, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2112127610', 'transit', 'metro', 'Alcorcón Central', 40.3499384, -3.8319872, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2132334632', 'education', 'school', 'Colegio Público Nuestra Señora del Rosario', 40.3985052, -3.3592342, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2135209915', 'education', 'school', 'Talleres Escolares Parroquiales', 40.3932744, -3.696035, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2139566957', 'healthcare', 'primary_care', 'Adeslas', 40.4259684, -3.5331915, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2140576943', 'education', 'school', 'Escuela Infantil Privada El Valle', 40.4240786, -3.532112, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2140576953', 'education', 'school', 'Escuela Infantil Privada Chulin', 40.4258696, -3.529897, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2162418071', 'healthcare', 'primary_care', 'Nuevo Centro Médico Majadahonda', 40.4677406, -3.8713843, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2204538524', 'healthcare', 'primary_care', 'Concejalía de salud y consumo', 40.4274748, -3.5330092, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2251286293', 'transit', 'train', 'Estación Alcalá de Henares Universidad', 40.5054439, -3.3353048, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2337140314', 'education', 'school', 'Escuela Infantil Mimitos', 40.4597849, -3.4461941, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2352895296', 'healthcare', 'primary_care', 'Psicotécnico', 40.3883799, -3.730269, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2352895297', 'healthcare', 'primary_care', 'Reconocimientos Lucero', 40.4041635, -3.7449567, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2367056505', 'education', 'school', 'Escuela Infantil Privada Bichines', 40.4179007, -3.5247269, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2394938575', 'education', 'school', 'Academia Phi', 40.6597319, -4.0263725, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2401803162', 'education', 'school', 'Escuela Infantil Manoplas', 40.5566891, -3.6599975, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2402710369', 'transit', 'train', 'Estación Alcobendas - San Sebastián de los Reyes', 40.5467468, -3.6346007, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2418082558', 'healthcare', 'primary_care', 'Centro de Salud Cáceres', 40.3986111, -3.6949476, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2435515903', 'education', 'school', 'Little Frogs', 40.4738142, -3.5918562, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2435519723', 'education', 'school', 'El Jardín de Larín II', 40.4732613, -3.5850005, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2458279632', 'education', 'school', 'Colegio San Martín', 40.4113425, -3.6488624, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2462424270', 'healthcare', 'hospital', 'Gerencia Sermas', 40.4681204, -3.7267737, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2462938317', 'healthcare', 'primary_care', 'Clínica Baviera', 40.4290209, -3.6889198, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2475037929', 'education', 'school', 'Kids & Us', 40.4010532, -3.7085377, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2475150021', 'healthcare', 'primary_care', 'CMS Arganzuela', 40.4055241, -3.7101753, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2475432547', 'education', 'school', 'Valleaguado', 40.4281985, -3.5399707, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2477470267', 'education', 'school', 'Escuela Infantil Parque de Bolas', 40.3647685, -3.5884767, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2483039026', 'healthcare', 'primary_care', 'Clínica Frontela', 40.4311082, -3.7067605, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2485212882', 'education', 'school', 'Educando', 40.4044913, -3.6714749, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2492874439', 'healthcare', 'primary_care', 'Doctor Fernando Caudevilla', 40.4122031, -3.6937533, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2500127260', 'healthcare', 'primary_care', 'Centro de Salud Pacífico', 40.4079866, -3.6769916, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2507159042', 'education', 'school', 'Escuela de Educación Infantil El Pollo Pepe', 40.1947289, -3.6916065, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2507432776', 'healthcare', 'primary_care', 'Wellcare Medica', 40.2462701, -3.7736748, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2542907152', 'transit', 'train', 'Estación Alcalá de Henares', 40.4890599, -3.366189, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2604874371', 'healthcare', 'primary_care', 'Centro Médico El Pilar', 40.4773034, -3.7123581, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2606153373', 'education', 'school', 'Academia Enseñalia', 40.4269887, -3.5293614, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2606153382', 'education', 'school', 'Centro de estudios Peco', 40.4282863, -3.5293491, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2609596171', 'transit', 'train', 'Estación Doce de Octubre', 40.3790211, -3.6987395, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2609596185', 'transit', 'train', 'Estación Embajadores', 40.4052249, -3.7028935, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2609596192', 'transit', 'train', 'Estación Maestra Justa Freire-Polideportivo Aluche', 40.3835465, -3.7686258, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2609596200', 'transit', 'train', 'Estación Laguna', 40.3992313, -3.7447243, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2609596207', 'transit', 'train', 'Estación Puente Alcocer', 40.3503366, -3.7050198, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2619644037', 'healthcare', 'primary_care', 'Dr Emilio Santos - Ginecología', 40.4257079, -3.6887819, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2632781253', 'healthcare', 'primary_care', 'Centro médico CEMAJ Miramadrid', 40.5012232, -3.5121221, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2633041360', 'healthcare', 'primary_care', 'Clínica Melisa', 40.3804038, -3.7777176, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2637985305', 'healthcare', 'primary_care', 'Consultorio Redueña', 40.8157438, -3.6032174, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2664863054', 'education', 'school', 'EF (Education First)', 40.4376079, -3.6787502, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2671114634', 'healthcare', 'primary_care', 'Centro Médico Conde Duque', 40.4295088, -3.7092051, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2672130958', 'education', 'school', 'Escuela Artística de Casarrubuelos', 40.1719384, -3.8292679, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2676855006', 'education', 'school', 'IDEM', 40.4228841, -3.7070591, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2678581209', 'healthcare', 'primary_care', 'Centro Salud Palma Norte', 40.4265453, -3.7073206, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2680844659', 'healthcare', 'hospital', 'Urgencias', 40.4648143, -3.4727526, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2683247329', 'education', 'school', 'Coloritos', 40.5544879, -3.6190834, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2683280970', 'healthcare', 'primary_care', 'Sanitas Millenium San Sebastián de los Reyes', 40.5473528, -3.6343049, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2683338216', 'healthcare', 'primary_care', 'Sanitas Millenium Alcobendas', 40.5374219, -3.6370239, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2685726044', 'healthcare', 'primary_care', 'Consultorio de Villaconejos', 40.1047747, -3.4850444, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2687080096', 'education', 'school', 'Comisión de Escolarización', 40.3152983, -3.8615773, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2699804643', 'education', 'school', 'Laocoonte', 40.4224185, -3.7061069, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2701969616', 'healthcare', 'primary_care', 'Clínica Madrid Vascular', 40.4244613, -3.6755987, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2702242065', 'education', 'school', 'Espacio Miscela', 40.389842, -3.7656093, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2710546186', 'healthcare', 'primary_care', 'Clínica Colmenero', 40.4674792, -3.6759625, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2723089091', 'healthcare', 'primary_care', 'Consultorio Local de Puebla de la Sierra', 41.0115799, -3.4450288, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2725101558', 'healthcare', 'primary_care', 'Gloria Vañó', 40.4258677, -3.7157976, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2758388980', 'healthcare', 'primary_care', 'Le Santé', 40.4039155, -3.6795134, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2779332327', 'education', 'school', 'Centro de Estudios Adams', 40.4270717, -3.6728627, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2799017159', 'education', 'school', 'Más Formados', 40.3623684, -3.5938483, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2799017165', 'healthcare', 'primary_care', 'Clínica Sastre', 40.364342, -3.6000038, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2804189704', 'healthcare', 'primary_care', 'Centro Médico Valdesalud', 40.39535, -3.623074, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2824456972', 'education', 'school', 'Alliance Française', 40.4202423, -3.7086547, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2831005277', 'education', 'school', 'FamilyHelp', 40.4025691, -3.6201858, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2831016559', 'healthcare', 'primary_care', 'Centro Médico Valdebernardo', 40.4026498, -3.6208174, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2864026501', 'healthcare', 'hospital', 'Centro médico Costa Rica', 40.4592666, -3.6689294, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2864197170', 'healthcare', 'primary_care', 'Tu podólogo', 40.4544729, -3.6962987, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2867455346', 'healthcare', 'primary_care', 'Instituto de Investigación del Sueño', 40.4589346, -3.6847588, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2875195507', 'healthcare', 'primary_care', 'Clínica Habla', 40.4235633, -3.5360138, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2880462307', 'healthcare', 'primary_care', 'Dorsia Clínicas', 40.4439805, -3.7028335, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2885281172', 'education', 'school', 'Alas de Papel', 40.4575205, -3.4389223, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2943939065', 'education', 'school', 'Academia Liceo Madrid', 40.3958261, -3.7149565, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2955163343', 'healthcare', 'primary_care', 'Clínica del Pie', 40.4644699, -3.7098498, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2955747926', 'healthcare', 'hospital', 'Instituto Anatómico Forense', 40.4437878, -3.7229335, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2972149035', 'education', 'school', 'Chiquitín Cuatro Caminos', 40.4479351, -3.704028, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2992291568', 'education', 'school', 'Colorines', 40.4187125, -3.5280755, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_2993001460', 'healthcare', 'primary_care', 'Centro Médico Humanes', 40.2514167, -3.8302935, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3005355600', 'healthcare', 'hospital', 'Hospital HM Vallés', 40.4829946, -3.367335, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3005398482', 'education', 'school', 'Dino', 40.4073426, -3.6367981, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3005537278', 'education', 'school', 'Carrusel', 40.5518237, -3.4571712, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3008634080', 'healthcare', 'primary_care', 'Fisiodia', 40.4043475, -3.8971026, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3015899607', 'healthcare', 'primary_care', 'Centro de Salud Lavapiés', 40.407934, -3.703684, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3051593565', 'education', 'school', 'Escuela Infantil Privada Pequeñecos', 40.4241356, -3.5604111, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3068221416', 'healthcare', 'primary_care', 'Vithas', 40.4594696, -3.6881935, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3086755878', 'healthcare', 'primary_care', 'Centro de Salud La Garena', 40.4812406, -3.3940616, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3102862271', 'education', 'school', 'Guardería', 40.4899266, -3.5914327, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3102862273', 'healthcare', 'primary_care', 'Servicio médico', 40.4675872, -3.5697978, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3102862274', 'healthcare', 'primary_care', 'Servicio médico', 40.4927288, -3.5923718, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3102862275', 'healthcare', 'primary_care', 'Servicio médico', 40.4941675, -3.5665978, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3103675729', 'education', 'school', 'Speak to me', 40.4315664, -3.7197213, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3105903089', 'healthcare', 'primary_care', 'Clínica podológica', 40.2141946, -3.8556194, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3105925535', 'healthcare', 'primary_care', 'Centro de Salud Griñón', 40.2156733, -3.8511753, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3114600570', 'education', 'school', 'Academia Las Naciones', 40.285408, -3.8066845, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3121872860', 'healthcare', 'primary_care', 'Cotton salud', 40.5809921, -3.9313459, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3121903284', 'healthcare', 'primary_care', 'Consulta Médica Torrelodones', 40.5796462, -3.9306861, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3124057770', 'healthcare', 'primary_care', 'Centro de Salud Puerta del Ángel', 40.4108773, -3.7354979, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3126895744', 'healthcare', 'primary_care', 'Centro podológico', 40.3317774, -3.8649616, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3156988717', 'education', 'school', 'Escuela de Baile Dance On', 40.4271942, -3.5363441, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3205247389', 'healthcare', 'primary_care', 'Clínica Sastre', 40.4243822, -3.5462147, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3240923397', 'education', 'school', 'Come mai?', 40.426167, -3.7073135, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3245844246', 'healthcare', 'primary_care', 'Parque Salud', 40.6213317, -4.0097622, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3248014392', 'healthcare', 'primary_care', 'Fisioescénica', 40.4103252, -3.7077739, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3255185688', 'healthcare', 'primary_care', 'Fisiomed 2001', 40.326783, -3.8622933, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3255633065', 'education', 'school', 'Babylonia - Centro de Ocio Infantil', 40.4612034, -3.5814625, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3355218291', 'park', 'urban_park', 'Parque Estafeta', 40.3745717, -3.6942495, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3361624782', 'education', 'school', 'MacLuque School of English', 40.4250956, -3.7050966, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3367997379', 'healthcare', 'primary_care', 'Clínica Callao', 40.4209634, -3.704637, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3368048351', 'education', 'school', 'devorador.es', 40.4236895, -3.7028536, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3370051205', 'education', 'school', 'ACYM', 40.4278637, -3.7075402, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3370089385', 'education', 'school', 'Círculo de Baile', 40.4302083, -3.7077568, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3371089186', 'education', 'school', 'Escuelas antiguas (EMMyD)', 40.8598186, -3.7108243, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3374152201', 'education', 'school', 'Escuela municipal de arte dramático', 40.4277823, -3.6994701, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3402659928', 'education', 'school', 'Kids Brain School', 40.5739052, -3.9257591, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3406578357', 'education', 'school', 'Escuela infantil municipal Fernando el Católico', 40.4341181, -3.7096719, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3429280498', 'healthcare', 'primary_care', 'Consultorio Médico', 40.3059116, -3.9277223, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3457899484', 'healthcare', 'primary_care', 'IMD Instituto Médico Dermatológico', 40.4466542, -3.696187, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3457899485', 'healthcare', 'primary_care', 'Instituto Madrileño de Oncología', 40.4426627, -3.6824571, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3459875701', 'healthcare', 'primary_care', 'Clínica Dator', 40.4587714, -3.6962502, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3465168828', 'healthcare', 'primary_care', 'Clínica Los Ángeles', 40.3337792, -3.8654707, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3465168830', 'healthcare', 'primary_care', 'Consultorio Salzillo', 40.3335999, -3.8654103, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3465168832', 'education', 'school', 'E. I. Little Daisy', 40.3337645, -3.8645312, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3465168860', 'education', 'school', 'Princesas y Piratas', 40.3331607, -3.8652712, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3474958591', 'education', 'school', 'Academia de inglés Kids&Us', 40.4197041, -3.5715513, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3474971499', 'education', 'school', 'Los Cucos', 40.4198352, -3.5719051, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3475206471', 'healthcare', 'primary_care', 'Inion', 40.4629187, -3.7022656, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3478357634', 'healthcare', 'primary_care', 'Centro de Osteopatía Jada', 40.4240722, -3.708842, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3484378461', 'healthcare', 'primary_care', 'Clínica Adame', 40.4740411, -3.7113576, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3495503095', 'education', 'high_school', 'Adiestramiento canino Frajamo Madrid', 40.3251064, -3.9162043, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3495677025', 'healthcare', 'primary_care', 'consultorio médico', 40.9645431, -3.5848272, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3495733198', 'healthcare', 'primary_care', 'Consultorio médico', 41.005605, -3.5607229, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3513759167', 'education', 'school', 'CIE (Centro de Intercambios Escolares)', 40.5243301, -3.6852793, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3517146957', 'education', 'school', 'Family Moon', 40.4244376, -3.7060782, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3521995098', 'healthcare', 'primary_care', 'Consultorio local', 40.9532927, -3.5252809, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3522056586', 'healthcare', 'primary_care', 'Clínica Salud', 40.9216457, -3.5301202, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3526751796', 'healthcare', 'primary_care', 'Consultorio médico', 40.888229, -3.5607062, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3534432695', 'healthcare', 'primary_care', 'Navafis', 40.7303661, -4.0143693, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3558735235', 'healthcare', 'primary_care', 'Centro de Salud Av. de Aragón', 40.438284, -3.6371164, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3561459806', 'healthcare', 'primary_care', 'La Paloma', 40.4595796, -3.475733, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3590492094', 'healthcare', 'primary_care', 'Centro de Salud La Ventilla', 40.4714227, -3.6988481, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3600471430', 'healthcare', 'primary_care', 'Centro de Salud Párroco Julio Morate', 40.3972119, -3.6989382, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3609653256', 'education', 'school', 'Escuela Infantil Privada Jardín Infantil', 40.3937132, -3.6941595, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3619272157', 'healthcare', 'primary_care', 'Consultorio Médico', 40.3658764, -3.3221572, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3626480439', 'healthcare', 'primary_care', 'Ingletes', 40.4295818, -3.7073977, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3627672976', 'education', 'school', 'Eude Business School', 40.4658079, -3.6660313, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3631781471', 'education', 'school', 'Quattrocento', 40.4259735, -3.7055361, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3632159108', 'healthcare', 'primary_care', 'Centro Médico Medicae', 40.4502706, -3.4652222, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3634290119', 'healthcare', 'primary_care', 'AGE Ginecología y Obstetricia', 40.43287, -3.6960715, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3636842697', 'healthcare', 'primary_care', 'Centro Médico Infanta Mercedes', 40.4539943, -3.6989537, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3673294265', 'healthcare', 'primary_care', 'Luna', 40.4229271, -3.7068102, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3692962588', 'park', 'urban_park', 'Microjardín Huerta del Bayo', 40.4080349, -3.7053287, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3697389850', 'education', 'school', 'Caracol', 40.4380274, -3.6184254, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3706644980', 'healthcare', 'primary_care', 'Dr. Jesús Lago', 40.4272012, -3.7012915, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3744066396', 'healthcare', 'primary_care', 'Fisiozen', 40.3400543, -3.8360043, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3745249181', 'education', 'school', 'Mirasierra', 40.430754, -3.6398782, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3745254730', 'education', 'school', 'mirasierra', 40.4306755, -3.6401034, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3750959099', 'healthcare', 'primary_care', 'MCapilar', 40.4318742, -3.7242946, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3770264321', 'healthcare', 'primary_care', 'Podólogo - Clínica Los Cedros', 40.4700737, -3.6909792, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3770275284', 'healthcare', 'primary_care', 'Podólogo', 40.4694526, -3.6990817, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3770294613', 'healthcare', 'primary_care', 'Royal Model', 40.4733028, -3.6879504, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3770557458', 'healthcare', 'primary_care', 'Centro Madrid Salud de Tetuán', 40.4653709, -3.6935384, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3770668742', 'education', 'school', 'El Escondite', 40.4671774, -3.6936209, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3776287066', 'education', 'school', 'Escuela Infantil Mundo Mágico', 40.4041265, -3.5918038, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3842478330', 'healthcare', 'primary_care', 'Centro de Salud Universidad', 40.426509, -3.7061191, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3859922497', 'education', 'school', 'Cayena', 40.4570461, -3.6713609, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3868734068', 'healthcare', 'primary_care', 'Centro de Salud Núñez Morgado', 40.4682307, -3.685317, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3883100740', 'education', 'school', 'Escuela Infantil Nemomarlin', 40.4943268, -3.6169704, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3884037865', 'education', 'school', 'Escuela Infantil Madiba', 40.493318, -3.6123581, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3891875681', 'healthcare', 'primary_care', 'Psicotécnico La Luz', 40.4833249, -3.3648348, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3891877492', 'healthcare', 'primary_care', 'Policlínico HM Cruz Verde', 40.4846919, -3.3680564, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3895252430', 'healthcare', 'primary_care', 'Clínica Universitaria Universidad Europea', 40.4045346, -3.7154984, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3926222756', 'healthcare', 'primary_care', 'Clinica Silvano', 40.4634645, -3.6290529, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3926257461', 'healthcare', 'primary_care', 'Clinica Canillas', 40.4647257, -3.6352147, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3958298321', 'education', 'school', 'Enseñarte', 40.5537447, -3.6527187, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3982417637', 'healthcare', 'primary_care', 'Centro Madrid Salud Fuencarral', 40.4786143, -3.709417, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_3997458285', 'healthcare', 'primary_care', 'Don Psicotécnico', 40.3972198, -3.7151898, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4015340010', 'education', 'school', 'Nemomarlin', 40.4006551, -3.7116351, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4056301456', 'park', 'urban_park', 'La Sanchita', 40.3901416, -3.6963721, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4093682119', 'park', 'urban_park', 'Parque del Zoco', 40.3119526, -3.9243771, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4108431081', 'healthcare', 'primary_care', 'Clínica ADNA - Psicotécnicos', 40.4317757, -3.7110386, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4108856021', 'education', 'high_school', 'Instituto de Educación Secundaria Sabino Fernández Campo', 40.4988237, -4.2351438, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4116646629', 'education', 'school', 'Casa de niños', 40.5254326, -3.6833801, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4116646630', 'education', 'high_school', 'Instituto de Educación Secundaria Ciudad Escolar', 40.5239733, -3.6841936, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4173179529', 'healthcare', 'primary_care', 'Fisio Sierra Salud', 40.6294699, -4.0013798, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4173179537', 'healthcare', 'primary_care', 'Centro Médico de Rehabilitación Villalba', 40.6316182, -4.008143, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4242781185', 'healthcare', 'primary_care', 'Clínica del pie La Fortuna', 40.3602012, -3.7811799, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4246751108', 'healthcare', 'primary_care', 'Fisi(On)', 40.3311043, -3.7685821, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4247360989', 'healthcare', 'primary_care', 'Clínica Leganés', 40.3280907, -3.7634273, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4249154978', 'education', 'school', 'Ceysa Escuela de Instaladores', 40.390719, -3.7276804, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4249154979', 'healthcare', 'primary_care', 'Centro de Salud Alameda', 40.4119611, -3.6937885, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4249154981', 'healthcare', 'primary_care', 'Centro de Salud Delicias', 40.4042944, -3.6951567, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4249154982', 'healthcare', 'primary_care', 'Centro de Salud Potosí', 40.4570811, -3.6794443, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4249154983', 'healthcare', 'primary_care', 'Centro de Salud Príncipe de Vergara', 40.4400853, -3.6791289, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4262308211', 'healthcare', 'hospital', 'SUMMA112 - SUAP Colmenar Viejo Sur', 40.660293, -3.7617935, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4263118990', 'healthcare', 'primary_care', 'Clinica del Pie', 40.381304, -3.730932, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4266927861', 'healthcare', 'primary_care', 'Centro de Salud Castelló', 40.4285766, -3.6813351, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4266927862', 'healthcare', 'primary_care', 'Centro de Salud Cea Bermúdez', 40.4389029, -3.7071603, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4266927863', 'healthcare', 'primary_care', 'Centro de Salud Ibiza', 40.4185018, -3.6779675, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4266927864', 'healthcare', 'primary_care', 'Centro de Salud Londres', 40.4318699, -3.6658551, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4266927865', 'healthcare', 'primary_care', 'Centro de Salud María Auxiliadora', 40.4576786, -3.7139955, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4266927866', 'healthcare', 'primary_care', 'Centro de Salud Montesa', 40.4306159, -3.6720154, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4297076497', 'education', 'school', 'Text and Line', 40.4632672, -3.692619, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4307307093', 'healthcare', 'primary_care', 'Centro de Salud Abrantes', 40.3810938, -3.7274344, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4307307094', 'healthcare', 'primary_care', 'Centro de Salud Lagasca', 40.4355626, -3.6842767, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4307307095', 'healthcare', 'primary_care', 'Centro de Salud Mental Aguacate-Carabanchel', 40.3722019, -3.7479797, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4309733390', 'healthcare', 'primary_care', 'Clínica Murube', 40.4858593, -3.7095705, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4309798460', 'education', 'school', 'Integral Formación', 40.488944, -3.6908159, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4318194803', 'education', 'school', 'Pegasito', 40.4198969, -3.5674847, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4338212951', 'healthcare', 'primary_care', 'Consultorio médico de Alameda del Valle', 40.9180204, -3.8436609, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4339061360', 'healthcare', 'primary_care', 'Centro de Salud Daganzo', 40.5456509, -3.4597779, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4357245631', 'education', 'school', 'Artes Escénicas caraB', 40.4465699, -3.714879, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4364737290', 'healthcare', 'primary_care', 'Centro de Salud Algete', 40.5976222, -3.5030269, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4366000190', 'healthcare', 'primary_care', 'Instituto de Investigaciones del Sueño', 40.4635006, -3.680129, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4366287793', 'education', 'school', 'Cice', 40.4334615, -3.6763774, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4371419235', 'healthcare', 'primary_care', 'Servicio Médico de Salud Laboral de la Universidad Autónoma de Madrid', 40.5453067, -3.6927399, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4371435764', 'healthcare', 'primary_care', 'Servicio Médico de Salud Laboral del Consejo Superior de Investigaciones Científicas (CSIC)', 40.5453171, -3.6927431, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4399507366', 'healthcare', 'primary_care', 'CeaSalud', 40.438936, -3.7159761, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4405987839', 'transit', 'metro', 'Barajas', 40.4761602, -3.5834125, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4411311579', 'education', 'school', 'Enforex', 40.4295375, -3.7104699, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4416327895', 'healthcare', 'primary_care', 'Certificados Médicos', 40.4808917, -3.7125341, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4429708389', 'healthcare', 'primary_care', 'Clínica Román', 40.4347908, -3.7035739, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4431590891', 'education', 'school', 'St. Alice''s nursery', 40.4337925, -3.6950493, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4442930794', 'education', 'school', 'EAE', 40.443868, -3.6836118, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4447123890', 'healthcare', 'primary_care', 'Instituto Natividad Cano', 40.4344124, -3.7029297, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4449615329', 'education', 'school', 'Escuela de Educación Infantil Santa Madre Maravillas', 40.3215335, -3.7397201, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4462911983', 'education', 'high_school', 'Instituto de Educación Secundaria Antonio López García', 40.323915, -3.7256216, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4463399703', 'healthcare', 'primary_care', 'Centro de Salud Santa Hortensia', 40.4452403, -3.6699353, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4465700733', 'healthcare', 'primary_care', 'Centro de Salud Martín de Vargas', 40.403136, -3.7019971, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4494071393', 'education', 'school', 'Nemomarlin', 40.2998662, -3.9789503, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4501267395', 'healthcare', 'primary_care', 'Fisioreynst', 40.4873547, -3.7172229, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4510602482', 'healthcare', 'primary_care', 'Vitare', 40.3264898, -3.7627533, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4513230893', 'education', 'school', 'Edukative', 40.4184594, -3.569611, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4514136203', 'healthcare', 'primary_care', 'Clínica Elvia', 40.5559151, -3.6591474, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4529109192', 'education', 'school', 'Arte 4 Estudio de actores', 40.426213, -3.6616653, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4540067489', 'education', 'school', 'Centro cívico Rigoberta Menchú', 40.3361675, -3.7408501, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4543191092', 'education', 'school', 'Aphisa', 40.4778886, -3.3843673, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4557645968', 'education', 'high_school', 'Instituto de Educación Secundaria Escuela Superior de Hostelería y Turismo', 40.4152906, -3.7325234, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4582592303', 'healthcare', 'primary_care', 'Madrid Health Chiropractic', 40.421758, -3.6770426, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4582967790', 'healthcare', 'primary_care', 'Unica. Centro médico estético', 40.4229391, -3.7213602, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4591381590', 'healthcare', 'primary_care', 'Clínica el Olivo', 40.4187608, -3.5708067, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4596524601', 'education', 'school', 'Suma-t', 40.4356905, -3.654007, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4629768501', 'healthcare', 'primary_care', 'Clínica Varela Reyes', 40.4318688, -3.7230127, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4632218604', 'healthcare', 'primary_care', 'RC Clinic', 40.4310268, -3.7229967, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4639506186', 'healthcare', 'primary_care', 'L''Esthétique', 40.4464613, -3.5874521, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4644354037', 'healthcare', 'primary_care', 'Rosales', 40.4304458, -3.7213349, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4644400491', 'healthcare', 'primary_care', 'ClinEnc', 40.429718, -3.7209172, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4676999577', 'healthcare', 'primary_care', 'PSI', 40.4075342, -3.7106156, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4676999579', 'education', 'school', 'L''Ecole du Flam', 40.4075366, -3.7105049, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4678508180', 'healthcare', 'primary_care', 'Podólogo', 40.4124224, -3.6969169, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4683230793', 'healthcare', 'primary_care', 'Mommy&me 4D. Ecografías 4D', 40.4348011, -3.7040455, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4683555366', 'education', 'school', 'Hanban', 40.426622, -3.7191829, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4684446970', 'healthcare', 'primary_care', 'CEMECO', 40.5754431, -3.9299441, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4685378463', 'healthcare', 'primary_care', 'Fuexpert Clinic', 40.4418027, -3.705018, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4685423233', 'healthcare', 'primary_care', 'Kinect', 40.4392594, -3.7063926, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4686842764', 'healthcare', 'primary_care', 'Lola Sopeña', 40.426109, -3.7174055, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4695486087', 'healthcare', 'primary_care', 'Blue Moon', 40.4326037, -3.7076807, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4697537570', 'park', 'urban_park', 'Moscatelares', 40.5440427, -3.6194875, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4701447662', 'healthcare', 'primary_care', 'Fised', 40.4258414, -3.7121215, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4703722692', 'healthcare', 'primary_care', 'Centro de Salud Pozuelo Estación', 40.4390019, -3.80238, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4705285134', 'healthcare', 'primary_care', 'Podoactiva', 40.4331995, -3.6997843, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4705555494', 'healthcare', 'primary_care', 'Centro Médico Somosaguas', 40.4387882, -3.816941, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4706463595', 'healthcare', 'primary_care', 'Centro de salud', 40.4064307, -3.3640156, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4706487393', 'education', 'school', 'Escuela infantil Nuestra Señora del Rosario', 40.398982, -3.3580699, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4706489194', 'education', 'school', 'Escuela Infantil El Sastrecillo Valiente', 40.4008272, -3.3579448, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4708436845', 'healthcare', 'primary_care', 'Ana Ramos', 40.4282471, -3.7013255, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4716226494', 'education', 'school', 'Bradford. School of English', 40.4205205, -3.5672179, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4716306096', 'education', 'school', 'Centro de Estudios Madrid Noreste', 40.4171281, -3.5740072, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4716306097', 'education', 'school', 'Escuela de Arte y Creatividad Casiopea', 40.4174866, -3.5734327, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4719048604', 'education', 'school', 'Kitchen Club', 40.4214693, -3.7034944, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4721929916', 'healthcare', 'primary_care', 'Centro de Salud Ventura Rodríguez', 40.4252203, -3.7137655, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4741575157', 'healthcare', 'primary_care', 'Arco Iris', 40.4137358, -3.7199646, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4754813424', 'healthcare', 'primary_care', 'Clínica Sapra', 40.4351166, -3.8108456, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4756336421', 'education', 'school', 'Albany School of English', 40.4340889, -3.8047691, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4761968022', 'healthcare', 'primary_care', 'Centro Integral de Salud', 40.4463324, -3.800897, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4767691525', 'healthcare', 'primary_care', 'Pozuelo Estación', 40.4473515, -3.801251, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4776369664', 'healthcare', 'primary_care', 'CQS', 40.4473201, -3.7034089, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4780106655', 'healthcare', 'primary_care', 'Dr. Fernando Itza Santos', 40.4559203, -3.6890674, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4786498719', 'education', 'school', 'trazos_', 40.421763, -3.7137542, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4794225362', 'healthcare', 'primary_care', 'Centro de Salud Aranjuez', 40.0317689, -3.5985705, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4800653126', 'education', 'school', 'Colegio San Javier', 40.397896, -3.7054017, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4804507522', 'healthcare', 'primary_care', 'Sanro Electromedicina', 40.4463821, -3.8008652, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4808671426', 'healthcare', 'primary_care', 'Sanitas', 40.4391582, -3.7906175, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4810100126', 'education', 'school', 'Internacional Aravaca', 40.4528868, -3.7723821, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4813622832', 'healthcare', 'primary_care', 'PsicoClinic', 40.4359778, -3.8141764, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4839043121', 'healthcare', 'primary_care', 'Consultorio Barrio de la Estación', 40.4421679, -3.534174, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4839964729', 'education', 'school', 'Colegio San Luis de los Franceses', 40.4365183, -3.8106777, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4839971022', 'healthcare', 'primary_care', 'Centro Médico París', 40.4337088, -3.8077001, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4839971023', 'education', 'school', 'Escuela de Matemáticas Thales', 40.4336254, -3.8079343, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4856115485', 'healthcare', 'primary_care', 'EuroCentro Laser', 40.4195125, -3.797454, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4861528733', 'healthcare', 'primary_care', 'Clinica Baviera', 40.483627, -3.36294, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4869903621', 'healthcare', 'primary_care', 'Psicólogos Pozuelo', 40.434941, -3.8034373, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4879085586', 'healthcare', 'primary_care', 'Centro Médico Estético Sanchinarro', 40.4923922, -3.6526303, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4886528192', 'education', 'school', 'Trastes', 40.4958237, -3.6741275, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4891339162', 'education', 'school', 'Nemomarlin', 40.5093374, -3.677161, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4892851842', 'transit', 'metro', 'Diego de León', 40.4342041, -3.6749689, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4898937756', 'healthcare', 'primary_care', 'Clínica Vaos', 40.5042247, -3.6736494, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4898937758', 'education', 'school', 'Miniclub', 40.5043022, -3.672494, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4901294340', 'education', 'school', 'My Little Planet', 40.4999177, -3.6724316, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4901294346', 'healthcare', 'primary_care', 'Policlínico HM Las Tablas', 40.5003976, -3.6728454, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4904060715', 'education', 'school', 'Tábata', 40.4720578, -3.7139314, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4910632321', 'education', 'school', 'Kiddu', 40.4432646, -3.7850005, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4912161023', 'transit', 'metro', 'Parque Oeste', 40.3458164, -3.849049, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4913017293', 'education', 'school', 'Kids&Us - Inglés para niños', 40.560577, -3.6155252, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4913021888', 'healthcare', 'primary_care', 'Fremap Alcorcón', 40.3446235, -3.8116725, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4913023242', 'healthcare', 'primary_care', 'Fraternidad Muprespa', 40.3406988, -3.8149613, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4915662124', 'healthcare', 'primary_care', 'Clínica Iomm', 40.4482077, -3.784649, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4917488221', 'education', 'school', 'Academia Aprobando', 40.4410023, -3.7900857, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4927547644', 'healthcare', 'primary_care', 'Policlínico Hm Virgen del Val', 40.4846622, -3.3467708, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4927547649', 'education', 'school', 'Academia Carta Blanca', 40.4838263, -3.3466327, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4928548127', 'education', 'school', 'Academia Omega', 40.486386, -3.3512518, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4931488421', 'education', 'school', 'Todokine', 40.4064092, -3.7419086, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4932282723', 'education', 'school', 'Topitos', 40.6363481, -4.0034647, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4938697727', 'education', 'school', 'Complubot Centro de Robótica Educativa', 40.4903339, -3.3501078, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4942810875', 'healthcare', 'primary_care', 'Ripoll y De Prado', 40.4306632, -3.6923262, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4945492323', 'education', 'school', 'Centro Acuarelas', 40.4877902, -3.3468664, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4945505923', 'education', 'school', 'Centro de Estudios Grafton', 40.4871982, -3.346299, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4949086503', 'education', 'high_school', 'Centro de Formación Profesional', 40.4938019, -3.3471268, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4951801121', 'healthcare', 'primary_care', 'Aver', 40.422014, -3.6798717, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4955199721', 'education', 'school', 'Academia Ruffini', 40.4349358, -3.8112167, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4955597023', 'healthcare', 'primary_care', 'PsiKids', 40.43253, -3.8082496, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4955597024', 'education', 'school', 'Pimienta y Sal - Escuela de Cocina', 40.4324066, -3.808112, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4955643322', 'education', 'school', 'El Jardín del Tomillar', 40.4323454, -3.8068252, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4957167424', 'education', 'school', 'Little Bubbles', 40.3568717, -3.6969848, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4958233630', 'education', 'school', 'Academia Villaverde', 40.4868336, -3.3520573, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4958234323', 'healthcare', 'primary_care', 'Clínica Oriente', 40.4877208, -3.3531609, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4959037001', 'education', 'school', 'Jardín de Infancia Parchís', 40.4878508, -3.3502174, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4963459124', 'education', 'school', 'Delta Formación', 40.5004513, -3.365601, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4963459422', 'healthcare', 'primary_care', 'Laboratorio de Análisis Doctor Goya', 40.5004931, -3.3656209, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4994876896', 'healthcare', 'primary_care', 'Centro de Salud', 40.1367536, -3.5715419, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4998670036', 'transit', 'metro', 'Nuevos Ministerios', 40.4458416, -3.6916991, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_4999319356', 'transit', 'train', 'Estación Recoletos', 40.4224959, -3.6917042, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5004747021', 'education', 'school', 'Centro de Estudios Newton', 40.4850104, -3.3438648, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5024107175', 'healthcare', 'primary_care', 'Clínica Eugin Madrid', 40.4083859, -3.6889436, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5056117796', 'healthcare', 'primary_care', 'Servicio Médico', 40.467125, -3.6141037, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5056117797', 'healthcare', 'primary_care', 'Servicio Médico', 40.4693178, -3.6177653, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5104461622', 'healthcare', 'primary_care', 'Clínica Coslada', 40.4269108, -3.5506081, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5113389366', 'healthcare', 'primary_care', 'quirónsalud', 40.5997077, -3.7134805, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5119398433', 'healthcare', 'primary_care', 'eFISIO', 40.3852911, -3.723475, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5147415347', 'education', 'school', 'Escuela Infantil La Estrella', 40.4107923, -3.6660411, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5171228121', 'education', 'school', 'Dinamia', 40.511246, -3.363334, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5214698612', 'education', 'school', 'ChiquiTin', 40.3277064, -3.7440425, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5223794226', 'healthcare', 'primary_care', 'Psicoterapia en la Arganzuela', 40.3910423, -3.6868428, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5228852264', 'healthcare', 'primary_care', 'Centro Capilar Mariano García', 40.4718055, -3.8678118, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5228852266', 'healthcare', 'primary_care', 'desQbre Majadahonda', 40.4718724, -3.8677996, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5236233659', 'education', 'school', 'Centro Estudios Éfeso', 40.5524248, -3.66048, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5240751635', 'education', 'school', 'Es-cool Escuela Infantil Vallecas', 40.3970522, -3.6623905, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5259756625', 'park', 'urban_park', 'Parque de juegos infantil', 40.4772177, -3.3583683, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5277516030', 'education', 'school', 'La Salle Universitario', 40.4666643, -3.7815227, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5278558226', 'healthcare', 'primary_care', 'Betancourt', 40.4321036, -3.8037211, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5283931122', 'healthcare', 'primary_care', 'RG', 40.4450316, -3.7844374, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5294927196', 'healthcare', 'primary_care', 'Clínica Famed', 40.57685, -3.9279812, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299261414', 'transit', 'metro', 'Tetuán', 40.4608552, -3.6982259, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299262123', 'transit', 'metro', 'Plaza de Castilla', 40.4662822, -3.6896636, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299262124', 'transit', 'metro', 'Chamartín', 40.4739539, -3.6827087, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299262125', 'transit', 'metro', 'Bambú', 40.4769812, -3.676614, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299262126', 'transit', 'metro', 'Pinar de Chamartín', 40.4800504, -3.6670518, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314561', 'transit', 'metro', 'Valdecarros', 40.3599901, -3.5921171, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314562', 'transit', 'metro', 'Las Suertes', 40.3635039, -3.5991634, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314564', 'transit', 'metro', 'Congosto', 40.3721977, -3.6187268, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314565', 'transit', 'metro', 'Villa de Vallecas', 40.3794304, -3.6213251, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314566', 'transit', 'metro', 'Sierra de Guadalupe', 40.3825816, -3.6249212, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314567', 'transit', 'metro', 'Miguel Hernández', 40.387548, -3.6400068, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314568', 'transit', 'metro', 'Alto del Arenal', 40.3900497, -3.6458127, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314569', 'transit', 'metro', 'Buenos Aires', 40.3916235, -3.653876, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314570', 'transit', 'metro', 'Portazgo', 40.3930132, -3.659194, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314571', 'transit', 'metro', 'Nueva Numancia', 40.395963, -3.6647621, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314572', 'transit', 'metro', 'Puente de Vallecas', 40.3980926, -3.6689662, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314576', 'transit', 'metro', 'Atocha', 40.4069749, -3.6886008, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314577', 'transit', 'metro', 'Estación del Arte', 40.4088389, -3.6914748, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314578', 'transit', 'metro', 'Antón Martín', 40.412291, -3.699089, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314579', 'transit', 'metro', 'Tirso de Molina', 40.4123608, -3.7045846, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314581', 'transit', 'metro', 'Gran Vía', 40.4199123, -3.7016189, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314583', 'transit', 'metro', 'Tribunal', 40.4262415, -3.7010942, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314587', 'transit', 'metro', 'Iglesia', 40.4352634, -3.6990132, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314588', 'transit', 'metro', 'Ríos Rosas', 40.4415935, -3.7015924, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5299314590', 'transit', 'metro', 'Alvarado', 40.4500867, -3.7035098, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5300617226', 'education', 'school', 'Colegio San Antonio de Padua', 40.4329043, -3.7131801, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5301275540', 'park', 'urban_park', 'Matilde de la Torre', 40.3762842, -3.4860442, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5301853067', 'transit', 'metro', 'Sol', 40.416938, -3.7033901, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5301853068', 'transit', 'metro', 'Valdeacederas', 40.4645262, -3.694999, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5301853069', 'transit', 'metro', 'Estrecho', 40.4545136, -3.7027568, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302030275', 'transit', 'metro', 'Colombia', 40.4571156, -3.6769611, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302030277', 'transit', 'metro', 'Pinar del Rey', 40.4678284, -3.6486781, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302030279', 'transit', 'metro', 'Mar de Cristal', 40.4698205, -3.6385808, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302030283', 'transit', 'metro', 'Feria de Madrid', 40.464, -3.6163088, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302030284', 'transit', 'metro', 'Aeropuerto T1-T2-T3', 40.4679143, -3.5717593, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302030285', 'transit', 'metro', 'Barajas', 40.4758121, -3.5826207, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302030286', 'transit', 'metro', 'Aeropuerto T4', 40.4924348, -3.5928387, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302031695', 'transit', 'metro', 'Barajas', 40.4762898, -3.5834408, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296020', 'transit', 'metro', 'Manoteras', 40.4766992, -3.662679, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296721', 'transit', 'metro', 'Hortaleza', 40.4747276, -3.652125, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296722', 'transit', 'metro', 'Parque de Santa María', 40.4771257, -3.6456986, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296724', 'transit', 'metro', 'San Lorenzo', 40.4745618, -3.6396107, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296726', 'transit', 'metro', 'Canillas', 40.4637721, -3.6354426, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296727', 'transit', 'metro', 'Esperanza', 40.4592436, -3.6455644, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296728', 'transit', 'metro', 'Arturo Soria', 40.455936, -3.6561772, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296729', 'transit', 'metro', 'Avenida de la Paz', 40.4532165, -3.6621876, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296730', 'transit', 'metro', 'Alfonso XIII', 40.4482221, -3.6678923, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296731', 'transit', 'metro', 'Prosperidad', 40.4442092, -3.6748514, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296732', 'transit', 'metro', 'Diego de León', 40.434474, -3.6747205, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296733', 'transit', 'metro', 'Lista', 40.4293973, -3.6753988, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296734', 'transit', 'metro', 'Goya', 40.4246991, -3.6762001, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296735', 'transit', 'metro', 'Velázquez', 40.4251769, -3.682539, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296736', 'transit', 'metro', 'Serrano', 40.4253869, -3.6869007, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296737', 'transit', 'metro', 'Colón', 40.4258007, -3.6920413, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296738', 'transit', 'metro', 'Alonso Martínez', 40.4274063, -3.695983, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296740', 'transit', 'metro', 'San Bernardo', 40.4297715, -3.705761, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302296743', 'transit', 'metro', 'Argüelles', 40.4307266, -3.7161715, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5302313738', 'transit', 'metro', 'Avenida de América', 40.4376477, -3.6772962, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127327', 'transit', 'metro', 'Casa de Campo', 40.4034858, -3.7609309, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127329', 'transit', 'metro', 'Campamento', 40.3946832, -3.7682788, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127330', 'transit', 'metro', 'Empalme', 40.3907261, -3.765486, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127337', 'transit', 'metro', 'Eugenia de Montijo', 40.3844157, -3.7510629, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127338', 'transit', 'metro', 'Carabanchel', 40.3878172, -3.7449835, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127339', 'transit', 'metro', 'Vista Alegre', 40.3887883, -3.7400441, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127340', 'transit', 'metro', 'Oporto', 40.3886401, -3.7317242, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127342', 'transit', 'metro', 'Urgel', 40.3925341, -3.7253613, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127343', 'transit', 'metro', 'Marqués de Vadillo', 40.3974458, -3.7164041, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127344', 'transit', 'metro', 'Pirámides', 40.4020429, -3.7119409, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127346', 'transit', 'metro', 'Acacias', 40.4040749, -3.7059572, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127347', 'transit', 'metro', 'Puerta de Toledo', 40.4070507, -3.7110664, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127348', 'transit', 'metro', 'La Latina', 40.4112911, -3.7083094, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127351', 'transit', 'metro', 'Ópera', 40.4179827, -3.7094148, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127352', 'transit', 'metro', 'Callao', 40.4202937, -3.7059121, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127354', 'transit', 'metro', 'Chueca', 40.4226703, -3.6976743, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127356', 'transit', 'metro', 'Rubén Darío', 40.4330422, -3.6896897, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127357', 'transit', 'metro', 'Núñez de Balboa', 40.4326416, -3.6795551, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127359', 'transit', 'metro', 'Ventas', 40.4310642, -3.6635419, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127361', 'transit', 'metro', 'El Carmen', 40.4319699, -3.6561907, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127362', 'transit', 'metro', 'Quintana', 40.4331142, -3.6481458, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127363', 'transit', 'metro', 'Pueblo Nuevo', 40.4350329, -3.644171, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127365', 'transit', 'metro', 'Ciudad Lineal', 40.4379315, -3.6377404, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127366', 'transit', 'metro', 'Suanzes', 40.4408788, -3.6270164, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127367', 'transit', 'metro', 'Torre Arias', 40.443618, -3.6171219, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127368', 'transit', 'metro', 'Canillejas', 40.4491131, -3.6085862, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127371', 'transit', 'metro', 'El Capricho', 40.4533798, -3.5941978, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303127372', 'transit', 'metro', 'Alameda de Osuna', 40.4575814, -3.5879745, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173537', 'transit', 'metro', 'Moncloa', 40.4350196, -3.719236, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173540', 'transit', 'metro', 'Ventura Rodríguez', 40.4267606, -3.713295, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173541', 'transit', 'metro', 'Plaza de España', 40.423449, -3.7108809, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173543', 'transit', 'metro', 'Lavapiés', 40.4084539, -3.7006613, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173544', 'transit', 'metro', 'Embajadores', 40.4048124, -3.7022732, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173545', 'transit', 'metro', 'Palos de la Frontera', 40.4030849, -3.6947843, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173546', 'transit', 'metro', 'Delicias', 40.3993312, -3.6941225, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173547', 'transit', 'metro', 'Legazpi', 40.3914432, -3.6949558, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173549', 'transit', 'metro', 'Almendrales', 40.3839505, -3.6980105, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173550', 'transit', 'metro', 'Hospital 12 de Octubre', 40.37546, -3.6959057, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173551', 'transit', 'metro', 'San Fermín-Orcasur', 40.369987, -3.6943864, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173552', 'transit', 'metro', 'Ciudad de los Ángeles', 40.3601741, -3.69343, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173553', 'transit', 'metro', 'Villaverde Bajo - Cruce', 40.351034, -3.6926258, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303173554', 'transit', 'metro', 'San Cristóbal', 40.3416121, -3.6934141, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303271991', 'transit', 'metro', 'Cuatro Caminos', 40.4467812, -3.7039643, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303271993', 'transit', 'metro', 'Canal', 40.4386349, -3.704264, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303271995', 'transit', 'metro', 'Quevedo', 40.4331809, -3.7044934, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303271996', 'transit', 'metro', 'Noviciado', 40.4247733, -3.7073851, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303271997', 'transit', 'metro', 'Santo Domingo', 40.4204264, -3.7085723, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303271998', 'transit', 'metro', 'Sevilla', 40.4177659, -3.6999453, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303271999', 'transit', 'metro', 'Banco de España', 40.4190548, -3.6949256, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303272000', 'transit', 'metro', 'Retiro', 40.4204626, -3.6864269, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303272001', 'transit', 'metro', 'Príncipe de Vergara', 40.4226491, -3.6803686, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303272003', 'transit', 'metro', 'Manuel Becerra', 40.4281432, -3.6687107, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303272005', 'transit', 'metro', 'La Almudena', 40.4231715, -3.6382552, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303272006', 'transit', 'metro', 'Alsacia', 40.4182411, -3.6237899, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303272007', 'transit', 'metro', 'Avenida de Guadalajara', 40.422449, -3.6122237, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303272012', 'transit', 'metro', 'Retiro', 40.420447, -3.6864129, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5303272059', 'transit', 'metro', 'La Elipa', 40.4269992, -3.6494651, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304689519', 'transit', 'metro', 'Hospital del Henares', 40.417612, -3.5345145, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304689520', 'transit', 'metro', 'Henares', 40.4177888, -3.5270942, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690721', 'transit', 'metro', 'Jarama', 40.4233732, -3.5253633, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690722', 'transit', 'metro', 'San Fernando', 40.4244898, -3.5359662, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690723', 'transit', 'metro', 'La Rambla', 40.4251447, -3.5479154, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690725', 'transit', 'metro', 'Barrio del Puerto', 40.4224714, -3.5691052, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690726', 'transit', 'metro', 'Estadio Metropolitano', 40.4337998, -3.600962, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690727', 'transit', 'metro', 'Las Musas', 40.4325722, -3.6078503, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690728', 'transit', 'metro', 'San Blas', 40.4275001, -3.615954, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690729', 'transit', 'metro', 'Simancas', 40.4275549, -3.6229906, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690730', 'transit', 'metro', 'García Noblejas', 40.4286476, -3.6328626, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690731', 'transit', 'metro', 'Ascao', 40.4303119, -3.6404493, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690732', 'transit', 'metro', 'Barrio de la Concepción', 40.4393659, -3.6520984, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690733', 'transit', 'metro', 'Parque de las Avenidas', 40.4393064, -3.6629009, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690734', 'transit', 'metro', 'Cartagena', 40.4393935, -3.6717961, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690736', 'transit', 'metro', 'Gregorio Marañón', 40.4379941, -3.6912127, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690738', 'transit', 'metro', 'Alonso Cano', 40.4384455, -3.6992576, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690739', 'transit', 'metro', 'Islas Filipinas', 40.4390433, -3.7139784, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690740', 'transit', 'metro', 'Guzmán el Bueno', 40.4462739, -3.7131693, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690742', 'transit', 'metro', 'Francos Rodríguez', 40.4566118, -3.7121114, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690743', 'transit', 'metro', 'Valdezarza', 40.4649188, -3.7165189, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690744', 'transit', 'metro', 'Antonio Machado', 40.4701887, -3.7178808, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690745', 'transit', 'metro', 'Peñagrande', 40.4759519, -3.7160518, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690746', 'transit', 'metro', 'Avenida de la Ilustración', 40.4800446, -3.7183058, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304690747', 'transit', 'metro', 'Lacoma', 40.4851113, -3.7231023, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5304749212', 'transit', 'metro', 'Príncipe Pío', 40.4209619, -3.7193334, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305025415', 'transit', 'metro', 'Villaverde Alto', 40.3410325, -3.7117691, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116629', 'transit', 'metro', 'Parque Lisboa', 40.3494977, -3.8207793, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116632', 'transit', 'metro', 'Puerta del Sur', 40.3452072, -3.8120209, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116634', 'transit', 'metro', 'San Nicasio', 40.3367045, -3.7767659, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116635', 'transit', 'metro', 'Leganés Central', 40.3280922, -3.7723562, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116636', 'transit', 'metro', 'Hospital Severo Ochoa', 40.3217764, -3.7678287, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116637', 'transit', 'metro', 'Casa del Reloj', 40.3266736, -3.7594548, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116638', 'transit', 'metro', 'Julián Besteiro', 40.3346216, -3.7523849, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116640', 'transit', 'metro', 'El Bercial', 40.329394, -3.729993, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116641', 'transit', 'metro', 'Los Espartales', 40.3241766, -3.7183219, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116644', 'transit', 'metro', 'Juan de la Cierva', 40.311798, -3.7224742, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116645', 'transit', 'metro', 'Getafe Central', 40.3099984, -3.7340308, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116646', 'transit', 'metro', 'Alonso de Mendoza', 40.3001349, -3.7370513, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116647', 'transit', 'metro', 'Conservatorio', 40.2932486, -3.7457669, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116648', 'transit', 'metro', 'Arroyo Culebro', 40.2886235, -3.7567702, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116649', 'transit', 'metro', 'Parque de los Estados', 40.2866605, -3.7871681, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116650', 'transit', 'metro', 'Fuenlabrada Central', 40.2822879, -3.7982754, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116651', 'transit', 'metro', 'Parque Europa', 40.2852204, -3.8074481, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116652', 'transit', 'metro', 'Hospital de Fuenlabrada', 40.2858456, -3.815823, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116653', 'transit', 'metro', 'Loranca', 40.296741, -3.8367671, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116654', 'transit', 'metro', 'Manuela Malasaña', 40.3091106, -3.864774, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116655', 'transit', 'metro', 'Hospital de Móstoles', 40.3163098, -3.8744217, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116656', 'transit', 'metro', 'Pradillo', 40.3217118, -3.8648272, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116657', 'transit', 'metro', 'Móstoles Central', 40.3290012, -3.8634972, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305116658', 'transit', 'metro', 'Universidad Rey Juan Carlos', 40.3348569, -3.8721732, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305117623', 'transit', 'metro', 'El Bercial', 40.3292759, -3.729814, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486974', 'transit', 'metro', 'Laguna', 40.3993048, -3.7446368, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486975', 'transit', 'metro', 'Lucero', 40.4048009, -3.7452693, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486976', 'transit', 'metro', 'Alto de Extremadura', 40.4099947, -3.7384073, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486977', 'transit', 'metro', 'Puerta del Ángel', 40.4138284, -3.7271312, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486979', 'transit', 'metro', 'Ciudad Universitaria', 40.4438005, -3.7264206, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486980', 'transit', 'metro', 'Vicente Aleixandre', 40.446506, -3.7190437, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486981', 'transit', 'metro', 'República Argentina', 40.4443179, -3.6846392, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486982', 'transit', 'metro', 'O''Donnell', 40.422202, -3.6690629, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486983', 'transit', 'metro', 'Sainz de Baranda', 40.4143958, -3.6696729, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486986', 'transit', 'metro', 'Méndez Álvaro', 40.395717, -3.6801095, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486987', 'transit', 'metro', 'Arganzuela-Planetario', 40.3932319, -3.6884132, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486988', 'transit', 'metro', 'Usera', 40.3880344, -3.7056039, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486989', 'transit', 'metro', 'Plaza Elíptica', 40.3853557, -3.7178747, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486991', 'transit', 'metro', 'Opañel', 40.3869292, -3.7231777, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305486992', 'transit', 'metro', 'Carpetana', 40.3929166, -3.7409821, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305513281', 'transit', 'metro', 'Abrantes', 40.3809981, -3.7279849, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305513282', 'transit', 'metro', 'Pan Bendito', 40.3761821, -3.7341933, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305513283', 'transit', 'metro', 'San Francisco', 40.3736416, -3.7399534, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305513284', 'transit', 'metro', 'Carabanchel Alto', 40.3718832, -3.7517535, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305513285', 'transit', 'metro', 'La Peseta', 40.3630249, -3.7574077, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5305513286', 'transit', 'metro', 'La Fortuna', 40.3581963, -3.7776561, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5306531886', 'transit', 'metro', 'Arroyofresno', 40.4906807, -3.7259989, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307455072', 'transit', 'metro', 'Duque de Pastrana', 40.4674764, -3.6805854, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307455075', 'transit', 'metro', 'Ventilla', 40.4698213, -3.696293, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307455076', 'transit', 'metro', 'Barrio del Pilar', 40.4770471, -3.7035391, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307455077', 'transit', 'metro', 'Herrera Oria', 40.4846027, -3.7080099, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307455078', 'transit', 'metro', 'Mirasierra', 40.4910429, -3.7165397, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307477090', 'transit', 'metro', 'Pavones', 40.4005425, -3.6352111, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307477091', 'transit', 'metro', 'Artilleros', 40.4052627, -3.6418518, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307477092', 'transit', 'metro', 'Vinateros', 40.4103313, -3.6525288, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307477093', 'transit', 'metro', 'Estrella', 40.4112849, -3.661347, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307477094', 'transit', 'metro', 'Cruz del Rayo', 40.4444834, -3.6784632, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307477095', 'transit', 'metro', 'Ibiza', 40.4183658, -3.6781374, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307477096', 'transit', 'metro', 'Concha Espina', 40.4513295, -3.6776079, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307477097', 'transit', 'metro', 'Pío XII', 40.4618018, -3.6765305, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307497165', 'transit', 'metro', 'La Poveda', 40.3190333, -3.4777889, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307497168', 'transit', 'metro', 'Puerta de Arganda', 40.4012423, -3.5957286, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307497169', 'transit', 'metro', 'San Cipriano', 40.4039851, -3.6035493, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307497170', 'transit', 'metro', 'Vicálvaro', 40.4042034, -3.6088938, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5307497171', 'transit', 'metro', 'Valdebernardo', 40.3999118, -3.621522, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310126818', 'transit', 'metro', 'Lago', 40.4165076, -3.7348806, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310126819', 'transit', 'metro', 'Santiago Bernabéu', 40.4523667, -3.6907254, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310126820', 'transit', 'metro', 'Cuzco', 40.4594841, -3.6900166, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127221', 'transit', 'metro', 'Begoña', 40.4834526, -3.6869037, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127222', 'transit', 'metro', 'Fuencarral', 40.4947348, -3.6930692, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127223', 'transit', 'metro', 'Tres Olivos', 40.500966, -3.6946891, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127224', 'transit', 'metro', 'Montecarmelo', 40.5053359, -3.6959917, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127225', 'transit', 'metro', 'Las Tablas', 40.5083428, -3.6694346, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127226', 'transit', 'metro', 'Ronda de la Comunicación', 40.5151569, -3.6623169, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127227', 'transit', 'metro', 'La Granja', 40.5274337, -3.6585237, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127228', 'transit', 'metro', 'La Moraleja', 40.5320326, -3.6354938, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127229', 'transit', 'metro', 'Marqués de la Valdavia', 40.5404555, -3.6380507, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127230', 'transit', 'metro', 'Manuel de Falla', 40.5502221, -3.6469674, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127231', 'transit', 'metro', 'Baunatal', 40.5543838, -3.6350405, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127232', 'transit', 'metro', 'Reyes Católicos', 40.5509075, -3.6240552, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310127233', 'transit', 'metro', 'Hospital Infanta Sofía', 40.5598448, -3.6115488, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310153776', 'transit', 'metro', 'Joaquín Vilumbrales', 40.3497655, -3.8073186, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310153777', 'transit', 'metro', 'Cuatro Vientos', 40.3778953, -3.7919717, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310153778', 'transit', 'metro', 'Aviación Española', 40.3837137, -3.7840243, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310153779', 'transit', 'metro', 'Colonia Jardín', 40.3968629, -3.7747975, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310153781', 'transit', 'metro', 'Batán', 40.4078351, -3.7531173, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310233321', 'transit', 'train', 'Estación Palas de Rey', 40.5054595, -3.6650971, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310233342', 'transit', 'train', 'Estación Virgen del Cortijo', 40.4872436, -3.661223, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310233343', 'transit', 'train', 'Estación Fuente de la Mora', 40.4846824, -3.6630565, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310248072', 'transit', 'train', 'Estación Antonio Saura', 40.4853643, -3.6537279, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310248118', 'transit', 'train', 'Estación Álvarez de Villaamil', 40.4891668, -3.6513796, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310248129', 'transit', 'train', 'Estación Blasco Ibáñez', 40.4936729, -3.6558437, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5310248130', 'transit', 'train', 'Estación María Tudor', 40.4976043, -3.6584428, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311950985', 'transit', 'train', 'Estación Prado de la Vega', 40.4022818, -3.7813011, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311950988', 'transit', 'train', 'Estación Colonia de los Ángeles', 40.4072202, -3.7845032, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311950991', 'transit', 'train', 'Estación Prado del Rey', 40.4104269, -3.7875507, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311950992', 'transit', 'train', 'Estación Somosaguas Sur', 40.4157445, -3.7925931, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311950993', 'transit', 'train', 'Estación Somosaguas Centro', 40.4192936, -3.7987457, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311950994', 'transit', 'train', 'Estación Pozuelo Oeste', 40.4230677, -3.8045876, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311950995', 'transit', 'train', 'Estación Bélgica', 40.4305885, -3.8075282, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311950998', 'transit', 'train', 'Estación Dos Castillas', 40.4325414, -3.801613, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311950999', 'transit', 'train', 'Estación Campus de Somosaguas', 40.4334436, -3.7951423, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311951000', 'transit', 'train', 'Estación Avenida de Europa', 40.4390885, -3.7930351, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5311951001', 'transit', 'train', 'Estación Berna', 40.4448182, -3.7911721, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202297', 'transit', 'train', 'Estación Puerta de Boadilla', 40.4078514, -3.9040061, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202298', 'transit', 'train', 'Estación Infante Don Luis', 40.4059413, -3.8974147, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202299', 'transit', 'train', 'Estación Siglo XXI', 40.4051271, -3.8926422, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202300', 'transit', 'train', 'Estación Nuevo Mundo', 40.4056393, -3.8856939, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202301', 'transit', 'train', 'Estación Boadilla Centro', 40.4071659, -3.8800807, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202302', 'transit', 'train', 'Estación Ferial de Boadilla', 40.4019726, -3.8793803, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202303', 'transit', 'train', 'Estación Cantabria', 40.3952888, -3.8643349, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202304', 'transit', 'train', 'Estación Prado del Espino', 40.3950215, -3.8476925, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202305', 'transit', 'train', 'Estación Ventorro del Cano', 40.3942024, -3.8380691, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202306', 'transit', 'train', 'Estación Montepríncipe', 40.397938, -3.8357916, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202307', 'transit', 'train', 'Estación Retamares', 40.3987189, -3.816743, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202308', 'transit', 'train', 'Estación Cocheras', 40.3968818, -3.8038544, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202309', 'transit', 'train', 'Estación Ciudad del Cine', 40.3945373, -3.79568, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202310', 'transit', 'train', 'Estación José Isbert', 40.3952606, -3.7899213, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5312202311', 'transit', 'train', 'Estación Ciudad de la Imagen', 40.3970933, -3.783987, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318415084', 'transit', 'train', 'Estación Pozuelo', 40.447408, -3.8000611, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318415085', 'transit', 'train', 'Estación Las Rozas', 40.4942937, -3.867936, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318415087', 'transit', 'train', 'Estación Pinto', 40.2429919, -3.7038365, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318415089', 'transit', 'train', 'Estación Getafe Industrial', 40.3055087, -3.7075792, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318415090', 'transit', 'train', 'Estación San Cristóbal Industrial', 40.3316317, -3.6993784, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318415091', 'transit', 'train', 'Estación San Cristóbal de los Ángeles', 40.3421965, -3.6837456, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318466125', 'transit', 'train', 'Estación Majadahonda', 40.4743387, -3.84597, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318466126', 'transit', 'train', 'Estación Aravaca', 40.4485813, -3.7854948, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318466127', 'transit', 'train', 'Estación Méndez Álvaro', 40.3956027, -3.6785934, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318507233', 'transit', 'train', 'Estación Valdebebas', 40.4818094, -3.6164188, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318548036', 'transit', 'train', 'Estación Aeropuerto T4', 40.4923256, -3.5935907, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5318600155', 'transit', 'train', 'Estación Asamblea de Madrid-Entrevías', 40.3816333, -3.6680241, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5320204128', 'transit', 'train', 'Estación Torrejón de Ardoz', 40.4547278, -3.479731, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5320204129', 'transit', 'train', 'Estación Vallecas', 40.3820582, -3.6247854, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5320204130', 'transit', 'train', 'Estación Santa Eugenia', 40.3871289, -3.6090858, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5320204131', 'transit', 'train', 'Estación Vicálvaro', 40.4012591, -3.5959253, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5320204132', 'transit', 'train', 'Estación San Fernando de Henares', 40.4426271, -3.5341077, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5320264660', 'transit', 'train', 'Estación Soto del Henares', 40.4638583, -3.4414217, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5320860232', 'transit', 'train', 'Estación Ciempozuelos', 40.1590643, -3.6101317, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5322057608', 'education', 'school', 'Colegío Público La Dehesa del Príncipe', 40.3796327, -3.7936215, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5323342056', 'transit', 'train', 'Estación Zarzalejo', 40.538631, -4.1579732, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5323342058', 'transit', 'train', 'Estación Santa María de la Alameda', 40.5688229, -4.2693185, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5323342059', 'transit', 'train', 'Estación Robledo de Chavela', 40.5212161, -4.2471363, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5330101189', 'transit', 'metro', 'Las Rosas', 40.4235572, -3.6028437, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5351413982', 'park', 'urban_park', 'FastLake', 40.494859, -3.8610127, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5356727162', 'healthcare', 'primary_care', 'Real Visión', 40.4296106, -3.7136388, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5364797746', 'education', 'school', 'Centro de Lenguas Extranjeras', 40.48054, -3.3640457, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5365885267', 'healthcare', 'primary_care', 'Aesthetic', 40.4304893, -3.7052845, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5370383957', 'park', 'urban_park', 'Parque de la Música', 40.2935304, -3.4458474, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5372973323', 'healthcare', 'primary_care', 'Consultorio Local', 40.6666579, -3.3929463, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5376343322', 'education', 'school', 'Casa de Niños Los Duendes', 40.6680121, -3.3926359, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5395722033', 'healthcare', 'primary_care', 'Instituto Gabriel Simón', 40.420659, -3.7014952, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5405810822', 'education', 'school', 'Residencia Calasanz', 40.4376864, -3.7154308, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5417382372', 'education', 'school', 'IMF Business School', 40.4023653, -3.6986708, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5418903156', 'education', 'school', 'Guardería Arcoíris', 40.3857348, -3.7307909, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5423856839', 'transit', 'metro', 'Bilbao', 40.4292705, -3.7019295, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5435131785', 'healthcare', 'primary_care', 'Centro médico Colmenarejo', 40.5611255, -4.0156401, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5448172309', 'transit', 'train', 'Estación El Pozo', 40.3761663, -3.6560947, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5462590351', 'transit', 'metro', 'Menéndez Pelayo', 40.4042973, -3.6811007, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5477916382', 'healthcare', 'primary_care', 'Clínica Londres', 40.4325217, -3.7049464, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5480357146', 'healthcare', 'hospital', 'Centro de Especialidades González Bueno', 40.4234652, -3.6271467, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5480377329', 'education', 'school', 'Centro de Estudios Náuticos Elcano', 40.4294867, -3.704161, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5488395042', 'education', 'school', 'Nuestra Señora del Carmen', 40.3447153, -3.7067466, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5520727734', 'education', 'school', 'PreSchool FEM', 40.4443141, -3.717435, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5531929912', 'park', 'urban_park', 'Zona para Cometas', 40.3758923, -3.7280309, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5582542724', 'healthcare', 'primary_care', 'Centro Internacional de Oftalmología Avanzada', 40.4371184, -3.6930873, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5609591623', 'healthcare', 'primary_care', 'Centro de Salud Infante don Luis de Borbón', 40.4026071, -3.8955187, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5625516321', 'healthcare', 'primary_care', 'Dorsia', 40.4339243, -3.8061754, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5629575293', 'healthcare', 'primary_care', 'Sanitas Salud', 40.3971693, -3.7171894, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5637876585', 'education', 'school', 'El arrullo', 40.3773382, -3.6190063, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5661456796', 'healthcare', 'primary_care', 'Consultorio Médico Dr. Casañas', 40.5764971, -4.0029366, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5665049447', 'healthcare', 'primary_care', 'Centro Médico Navarro Sánchez', 40.5754363, -4.0049601, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5668662523', 'education', 'school', 'universidad de Alcalá', 40.4795749, -3.3606037, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5673184921', 'healthcare', 'primary_care', 'FisioDía', 40.4449717, -3.7898467, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5676062037', 'education', 'school', 'Euroformac', 40.5772663, -4.00019, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5680226296', 'healthcare', 'primary_care', 'Clínica', 40.5767892, -4.0054086, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5711667222', 'healthcare', 'primary_care', 'Consultorio local Lozoyuela', 40.9243635, -3.6161731, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5714038452', 'healthcare', 'primary_care', 'Consulta local', 41.0778212, -3.4555423, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5787361053', 'education', 'school', 'Dundee School of English', 40.3360583, -3.7412961, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5792123697', 'education', 'school', 'Travesuras', 40.4067897, -3.9006355, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5795311154', 'healthcare', 'primary_care', 'Fisysport', 40.0328295, -3.5932398, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5802049419', 'healthcare', 'primary_care', 'Consultorio médico', 40.4219003, -3.6813572, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5828055839', 'healthcare', 'primary_care', 'Centro médico Psicotécnicos Gala', 40.5764178, -4.0043991, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5830692541', 'healthcare', 'primary_care', 'Medici', 40.4738113, -3.8706499, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5830703794', 'healthcare', 'primary_care', 'Osteón', 40.4923716, -3.8693072, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5838478286', 'healthcare', 'primary_care', 'Clínica de Diabetes', 40.4602324, -3.6855998, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5844649058', 'healthcare', 'primary_care', 'Clínica Chamartin', 40.4821662, -3.6717706, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5866175685', 'healthcare', 'primary_care', 'Gineco', 40.4246747, -3.6981703, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5868423604', 'transit', 'train', 'Estación Castillejo-Añover', 39.9495725, -3.7385925, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5893765872', 'education', 'school', 'Escuela Infantil Privada Menagar', 40.4562326, -3.6755088, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5893766093', 'healthcare', 'primary_care', 'The Beauty Concept', 40.4559598, -3.6758832, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5901499685', 'healthcare', 'primary_care', 'Tavad', 40.4730313, -3.7494731, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5906563085', 'healthcare', 'primary_care', 'Psiconueve', 40.4440471, -3.6962407, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5940402826', 'healthcare', 'primary_care', 'Clinica Ilion', 40.3592991, -3.9100798, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5952667316', 'healthcare', 'primary_care', 'Centro de Transfusiones de las Fuerzas Armadas (CTFAS)', 40.3899738, -3.7453227, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_5993843619', 'park', 'urban_park', 'Plaza mesa', 40.5116544, -3.6897497, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6004710989', 'education', 'school', 'Retamar', 40.4262768, -3.8059033, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6023188187', 'healthcare', 'primary_care', 'Psicología y Salud', 40.5792328, -3.9304787, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6037843775', 'education', 'high_school', 'Instituto de Educación Secundaria El Bercial', 40.3227758, -3.7407536, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6068519469', 'transit', 'train', 'Estación La Garena', 40.4803451, -3.3929927, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6070788202', 'healthcare', 'primary_care', 'Interacciona', 40.430438, -3.8097493, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6136116977', 'healthcare', 'hospital', 'Clínica del Dolor de Madrid', 40.4325782, -3.7086334, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6178980292', 'transit', 'train', 'Estación Parla', 40.2410464, -3.7693581, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6179305125', 'transit', 'train', 'Estación Villaverde Alto', 40.3415173, -3.7115865, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6179305128', 'transit', 'train', 'Estación Las Margaritas Universidad', 40.3229593, -3.7273094, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6179305132', 'transit', 'train', 'Estación Getafe Sector 3', 40.2882391, -3.7375097, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6179776526', 'transit', 'train', 'Estación Universidad Pontificia de Comillas', 40.5540616, -3.683493, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6179776542', 'transit', 'train', 'Estación Valdelasfuentes', 40.5473962, -3.6543921, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6181746477', 'transit', 'train', 'Estación Puerto de Navacerrada', 40.7843819, -4.0047417, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6185935418', 'transit', 'train', 'Estación Meco', 40.5346284, -3.298573, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6186804853', 'transit', 'metro', 'Pacífico', 40.4013961, -3.6748832, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6187761909', 'transit', 'metro', 'Conde de Casal', 40.4078121, -3.6701194, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6246050831', 'education', 'school', 'Centro de formación Grupo Euroformac', 40.5799586, -4.0046289, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6274254355', 'healthcare', 'primary_care', 'Consultorio Local Valdemorillo', 40.5010455, -4.065891, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6307737321', 'education', 'school', 'Escuela infantil Guaderia Los Bollitos', 40.4489396, -3.7086177, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6312285776', 'healthcare', 'primary_care', 'Miranza IOA Madrid', 40.4400203, -3.7096975, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6313090400', 'healthcare', 'primary_care', 'Fisioluma', 40.4503429, -3.7721394, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6313090491', 'healthcare', 'primary_care', 'Fuensalud', 40.4518661, -3.7848343, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6313090686', 'healthcare', 'primary_care', 'Salude', 40.4502429, -3.7723886, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6331984776', 'healthcare', 'primary_care', 'Análisis Centro Clínico Bienestar Salud', 40.4055018, -3.8893156, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6331984886', 'education', 'school', 'MD Image', 40.4038832, -3.8768825, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6334254385', 'healthcare', 'primary_care', 'Centro de Salud', 40.4972089, -3.965223, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6334389247', 'healthcare', 'primary_care', 'Nutricionista Terica Uriol', 40.427652, -3.6783375, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6347842685', 'park', 'urban_park', 'Parque del instituto', 40.2280153, -3.4433856, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6347842698', 'healthcare', 'primary_care', 'Clinica de Morata', 40.2302269, -3.433617, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6348133641', 'healthcare', 'primary_care', 'Urgencias Clínica Santa Elena', 40.4458403, -3.7163073, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6354922794', 'transit', 'metro', 'El Carrascal', 40.3364492, -3.7405905, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6393976871', 'transit', 'metro', 'Pitis', 40.4953016, -3.7255882, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6408760181', 'healthcare', 'primary_care', 'IOA Madrid - Innova Ocular', 40.4397078, -3.7097429, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6426514255', 'healthcare', 'primary_care', 'Clínica Oftalmológica Martínez de la Casa Matilla', 40.408436, -3.677954, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6432597239', 'education', 'school', 'ECM', 40.406633, -3.6506122, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6457474276', 'healthcare', 'primary_care', 'Consultorio Local', 40.5694754, -4.266386, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6482922685', 'education', 'school', 'Acaya', 40.4428755, -3.67196, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6483902376', 'healthcare', 'primary_care', 'Centro GF', 40.3575505, -3.9007209, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6517852252', 'healthcare', 'hospital', 'Urgencias Severo Ochoa', 40.3194528, -3.7691763, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6517852253', 'healthcare', 'hospital', 'Urgencias (Infantil) Severo Ochoa', 40.3196696, -3.7702062, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6549046303', 'education', 'school', 'El Cole de Celia y Pepe', 40.4674418, -3.8076158, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6563268590', 'education', 'school', 'Formacion Profesional CERTIFICA', 40.4395253, -3.6258676, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6567963457', 'healthcare', 'primary_care', 'Centro Médico La Paloma', 40.4469017, -3.4606199, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6601894485', 'education', 'school', 'Escuela de Filosofía Practica', 40.4773223, -3.8312981, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6651892719', 'healthcare', 'primary_care', 'Clínica Chamberí', 40.4310385, -3.7013265, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6654789144', 'education', 'school', 'Escuela Infantil "Mis Primeros Pasitos"', 40.3761169, -3.6095619, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6655131026', 'education', 'school', 'Escuela del Henares (Peluquería y Estética)', 40.4582486, -3.471194, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6655674043', 'healthcare', 'primary_care', 'Asepeyo', 40.4572782, -3.4738747, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6681640377', 'healthcare', 'primary_care', 'Centro Médico Prosalud', 40.3582117, -3.9039561, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6684049134', 'healthcare', 'primary_care', 'Clínica Doctor Naval', 40.4330631, -3.6735588, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6698823250', 'education', 'school', 'Escuela Infantil Astros', 40.290839, -3.8141207, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6723935327', 'education', 'high_school', 'Instituto Coordenadas de Gobernanza y Economía Aplicada', 40.4317009, -3.6921969, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6734987600', 'healthcare', 'primary_care', 'Instituto de Urología', 40.4376164, -3.6856058, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6745725487', 'healthcare', 'primary_care', 'Centro Médico Valdavia', 40.5427181, -3.6396467, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6745730339', 'healthcare', 'primary_care', 'Centro Clínico La Chopera', 40.5447312, -3.6524352, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6745738492', 'healthcare', 'primary_care', 'Clínica Madrid', 40.5458677, -3.6336333, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6745739410', 'healthcare', 'primary_care', 'Clínica Gaspar', 40.5451963, -3.6275301, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6755784362', 'park', 'urban_park', 'Pista de Patinaje y Bicis', 40.8245466, -3.5337927, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6755789822', 'park', 'urban_park', 'Cadenas Playground', 40.824382, -3.5340281, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6758999343', 'education', 'school', 'Futura (refuerzo escolar)', 40.3447594, -3.5209499, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6759002982', 'education', 'school', 'Kokoro (centro de estudios)', 40.3446678, -3.5241172, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6759058227', 'education', 'school', 'Helia''s (centro de estudios)', 40.3424006, -3.5188235, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6759075209', 'education', 'school', 'Academia Pixel', 40.3431637, -3.5196245, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6759268050', 'healthcare', 'primary_care', 'Consultorio de Becerril de la Sierra', 40.7145228, -3.9910062, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6761232527', 'healthcare', 'primary_care', 'Centro de diagnóstico por imagen', 40.2881702, -3.7988333, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6761232528', 'healthcare', 'primary_care', 'Clínica Pediátrica Loma', 40.2912132, -3.8077158, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6761232538', 'healthcare', 'primary_care', 'Centro Médico Psicotec', 40.2873479, -3.808671, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6761232539', 'healthcare', 'primary_care', 'Centro Médico San Esteban', 40.2876948, -3.7907559, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6764780923', 'healthcare', 'primary_care', 'Eternal Beauty Clinic', 40.4594132, -3.6769735, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6764785305', 'healthcare', 'primary_care', 'Eternal Beauty Clinic', 40.4520796, -3.6942722, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6767514489', 'healthcare', 'primary_care', 'Clínica Patro', 40.4280028, -3.6989453, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6796557199', 'park', 'urban_park', 'Parque del Olivar', 40.3466235, -4.0327838, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6823409719', 'transit', 'train', 'Estación Coslada', 40.4237334, -3.5610079, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6827667486', 'education', 'school', 'Tandem', 40.417057, -3.6956879, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6841096829', 'healthcare', 'primary_care', 'Clinica Ibermedic Sur', 40.2911556, -3.8041288, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6885254471', 'healthcare', 'primary_care', 'Centro Médico Sanchinarro', 40.4964667, -3.6555245, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6899188027', 'park', 'urban_park', 'MoroParque', 40.2795645, -4.3105793, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6899192594', 'park', 'urban_park', 'Parque de Casablanca', 40.2775223, -4.3054926, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6912403235', 'healthcare', 'primary_care', 'Clínica Cisme', 40.4267751, -3.5491928, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6912403236', 'healthcare', 'primary_care', 'Clínica Cisme', 40.42706, -3.5639074, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6922981204', 'healthcare', 'primary_care', 'Newfisio', 40.4325048, -3.8091563, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6922981252', 'education', 'school', 'Con Arte', 40.4403148, -3.8035346, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6945291306', 'healthcare', 'primary_care', 'Clínica CRES', 40.4542949, -3.6786819, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6950688688', 'healthcare', 'primary_care', 'Consultorio Local', 40.7694115, -3.5836652, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6970536603', 'transit', 'train', 'Estación Fuente de la Mora', 40.4849618, -3.6631142, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_6990655151', 'healthcare', 'primary_care', 'Centro de Salud Alcalá de Guadaira', 40.3896832, -3.6571531, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7011029503', 'healthcare', 'primary_care', 'Centro Médico-Quirúrgico de Enfermedades Digestivas', 40.4406671, -3.6819085, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7040967518', 'healthcare', 'primary_care', 'Radiólogos Cervantinos, S.L.', 40.486633, -3.3594474, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7044883744', 'transit', 'train', 'Estación Nuevos Ministerios', 40.4450104, -3.6919655, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7050620545', 'healthcare', 'primary_care', 'Casa de Socorro del Ayuntamiento de Alcalá de Henares', 40.4829442, -3.3679322, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7054294522', 'education', 'school', 'Spartancops', 40.4599655, -3.6944586, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7054294523', 'education', 'school', 'Spartancops', 40.4087231, -3.7372756, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7056339434', 'education', 'school', 'TEO', 40.439107, -3.694977, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7062273807', 'healthcare', 'primary_care', 'Policlínico HM Arapiles', 40.4334797, -3.7063989, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7068076327', 'healthcare', 'primary_care', 'Osteopatía RAquis', 40.435736, -3.7050883, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7071815906', 'healthcare', 'hospital', 'Consultorio Médico de Camarma de Esteruelas', 40.548336, -3.378612, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7072672941', 'education', 'school', 'Escuela de Jardinería Ayto. Alcorcón', 40.3394776, -3.8205861, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7090997015', 'healthcare', 'primary_care', 'Fisiofix', 40.4666838, -3.6867851, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7098666977', 'healthcare', 'primary_care', 'Policlínica Ipacsa', 40.4477892, -3.6665829, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7098666978', 'healthcare', 'primary_care', 'Ascires López de Hoyos', 40.4485581, -3.6677507, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7098666979', 'healthcare', 'primary_care', 'Cellosa Madrid', 40.4457618, -3.6710199, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7098681156', 'healthcare', 'primary_care', 'Policlínica Meprysa', 40.4279779, -3.6724512, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7098681157', 'healthcare', 'primary_care', 'Centro médico Nuñez de Balboa', 40.4278048, -3.6824523, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7120756480', 'healthcare', 'primary_care', 'Servicio médico', 40.4106862, -3.7607983, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7124113077', 'healthcare', 'primary_care', 'Centro Médico Deyre', 40.4320864, -3.7327848, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7124769358', 'education', 'school', 'Colegio de Educación Infantil Santa Bernardita', 40.4280737, -3.6716196, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7135966064', 'healthcare', 'primary_care', 'Centro Integral Oncológico Clara Campal', 40.4907039, -3.6668882, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7148221685', 'healthcare', 'primary_care', 'Clínica Ginefiv', 40.454781, -3.658831, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7160197799', 'education', 'school', 'Academia de Aviación del ET', 40.6991373, -3.7663579, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7170008788', 'healthcare', 'primary_care', 'Sanitas', 40.4352379, -3.7180596, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7174798181', 'healthcare', 'primary_care', 'Centro Médico Habana', 40.4591624, -3.6809836, '28001', '28001');

INSERT OR REPLACE INTO civic_facilities (id, type, subtype, name, latitude, longitude, municipality_code, postal_code) VALUES ('osm_7174798182', 'healthcare', 'primary_care', 'Clínica Armstrong Internacional', 40.4418931, -3.7124813, '28001', '28001');
