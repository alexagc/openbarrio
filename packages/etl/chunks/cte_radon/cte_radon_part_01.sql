-- Cloudflare D1 Batch Insert Chunk for cte_radon
CREATE INDEX IF NOT EXISTS idx_radon_muni ON cte_radon_municipalities(municipality_code);

CREATE INDEX IF NOT EXISTS idx_radon_prov ON cte_radon_municipalities(province_code);

BEGIN TRANSACTION;

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('01003', 'Aramaio', '01', 'Araba/Álava', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('01008', 'Arratzua-Ubarrundia', '01', 'Araba/Álava', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('01009', 'Asparrena', '01', 'Araba/Álava', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('01013', 'Barrundia', '01', 'Araba/Álava', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('01039', 'Moreda de Álava/Moreda Araba', '01', 'Araba/Álava', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('01043', 'Oyón-Oion', '01', 'Araba/Álava', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('01058', 'Legutio', '01', 'Araba/Álava', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('02043', 'Lezuza', '02', 'Albacete', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('02061', 'Pétrola', '02', 'Albacete', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('02086', 'Yeste', '02', 'Albacete', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04001', 'Abla', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04002', 'Abrucena', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04005', 'Alboloduy', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04007', 'Alcolea', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04008', 'Alcóntar', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04009', 'Alcudia de Monteagud', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04014', 'Almócita', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04018', 'Armuña de Almanzora', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04019', 'Bacares', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04020', 'Bayárcal', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04021', 'Bayarque', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04023', 'Beires', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04026', 'Benitagla', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04027', 'Benizalón', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04033', 'Castro de Filabres', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04036', 'Chercos', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04045', 'Fiñana', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04050', 'Gérgal', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04055', 'Instinción', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04056', 'Laroya', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04059', 'Lubrín', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04061', 'Lúcar', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04065', 'Nacimiento', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04066', 'Níjar', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04067', 'Ohanes', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04068', 'Olula de Castro', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04070', 'Oria', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04071', 'Padules', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04073', 'Paterna del Río', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04077', 'Rágol', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04082', 'Senés', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04083', 'Serón', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04084', 'Sierro', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04086', 'Sorbas', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04087', 'Suflí', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04088', 'Tabernas', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04089', 'Taberno', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04090', 'Tahal', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04092', 'Tíjola', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04094', 'Turrillas', '04', 'Almería', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04095', 'Uleila del Campo', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04097', 'Velefique', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('04901', 'Las Tres Villas', '04', 'Almería', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05001', 'Adanero', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05002', 'La Adrada', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05005', 'Albornos', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05007', 'Aldeanueva de Santa Cruz', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05008', 'Aldeaseca', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05010', 'La Aldehuela', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05012', 'Amavida', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05013', 'El Arenal', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05014', 'Arenas de San Pedro', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05015', 'Arevalillo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05016', 'Arévalo', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05017', 'Aveinte', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05018', 'Avellaneda', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05019', 'Ávila', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05021', 'El Barco de Ávila', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05022', 'El Barraco', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05023', 'Barromán', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05024', 'Becedas', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05025', 'Becedillas', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05026', 'Bercial de Zapardiel', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05027', 'Las Berlanas', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05029', 'Bernuy-Zapardiel', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05030', 'Berrocalejo de Aragona', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05033', 'Blascomillán', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05034', 'Blasconuño de Matacabras', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05035', 'Blascosancho', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05036', 'El Bohodón', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05037', 'Bohoyo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05038', 'Bonilla de la Sierra', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05039', 'Brabos', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05040', 'Bularros', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05041', 'Burgohondo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05042', 'Cabezas de Alambre', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05043', 'Cabezas del Pozo', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05044', 'Cabezas del Villar', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05045', 'Cabizuela', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05046', 'Canales', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05047', 'Candeleda', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05048', 'Cantiveros', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05049', 'Cardeñosa', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05051', 'La Carrera', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05052', 'Casas del Puerto', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05053', 'Casasola', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05054', 'Casavieja', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05055', 'Casillas', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05056', 'Castellanos de Zapardiel', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05057', 'Cebreros', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05058', 'Cepeda la Mora', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05059', 'Cillán', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05060', 'Cisla', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05061', 'La Colilla', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05062', 'Collado de Contreras', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05063', 'Collado del Mirón', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05064', 'Constanzana', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05065', 'Crespos', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05066', 'Cuevas del Valle', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05067', 'Chamartín', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05069', 'Donjimeno', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05070', 'Donvidas', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05072', 'Espinosa de los Caballeros', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05073', 'Flores de Ávila', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05074', 'Fontiveros', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05075', 'Fresnedilla', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05076', 'El Fresno', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05077', 'Fuente el Saúz', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05078', 'Fuentes de Año', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05079', 'Gallegos de Altamiros', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05080', 'Gallegos de Sobrinos', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05082', 'Gavilanes', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05083', 'Gemuño', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05084', 'Gilbuena', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05085', 'Gil García', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05086', 'Gimialcón', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05087', 'Gotarrendura', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05088', 'Grandes y San Martín', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05089', 'Guisando', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05090', 'Gutierre-Muñoz', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05092', 'Hernansancho', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05093', 'Herradón de Pinares', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05094', 'Herreros de Suso', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05095', 'Higuera de las Dueñas', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05096', 'La Hija de Dios', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05097', 'La Horcajada', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05099', 'Horcajo de las Torres', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05100', 'El Hornillo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05101', 'Hoyocasero', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05102', 'El Hoyo de Pinares', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05103', 'Hoyorredondo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05104', 'Hoyos del Collado', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05105', 'Hoyos del Espino', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05106', 'Hoyos de Miguel Muñoz', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05107', 'Hurtumpascual', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05108', 'Junciana', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05109', 'Langa', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05110', 'Lanzahíta', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05112', 'El Losar del Barco', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05113', 'Los Llanos de Tormes', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05114', 'Madrigal de las Altas Torres', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05115', 'Maello', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05117', 'Mamblas', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05118', 'Mancera de Arriba', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05119', 'Manjabálago y Ortigosa de Rioalmar', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05120', 'Marlín', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05121', 'Martiherrero', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05122', 'Martínez', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05123', 'Mediana de Voltoya', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05124', 'Medinilla', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05125', 'Mengamuñoz', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05127', 'Mijares', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05128', 'Mingorría', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05129', 'El Mirón', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05130', 'Mironcillo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05131', 'Mirueña de los Infanzones', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05132', 'Mombeltrán', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05133', 'Monsalupe', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05134', 'Moraleja de Matacabras', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05135', 'Muñana', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05136', 'Muñico', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05138', 'Muñogalindo', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05139', 'Muñogrande', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05140', 'Muñomer del Peco', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05141', 'Muñopepe', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05142', 'Muñosancho', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05143', 'Muñotello', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05144', 'Narrillos del Álamo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05145', 'Narrillos del Rebollar', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05147', 'Narros del Castillo', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05148', 'Narros del Puerto', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05149', 'Narros de Saldueña', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05151', 'Navacepedilla de Corneja', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05152', 'Nava de Arévalo', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05153', 'Nava del Barco', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05154', 'Navadijos', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05155', 'Navaescurial', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05156', 'Navahondilla', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05157', 'Navalacruz', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05158', 'Navalmoral', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05159', 'Navalonguilla', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05160', 'Navalosa', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05161', 'Navalperal de Pinares', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05162', 'Navalperal de Tormes', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05163', 'Navaluenga', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05164', 'Navaquesera', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05165', 'Navarredonda de Gredos', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05166', 'Navarredondilla', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05167', 'Navarrevisca', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05168', 'Las Navas del Marqués', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05169', 'Navatalgordo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05170', 'Navatejares', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05171', 'Neila de San Miguel', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05172', 'Niharra', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05173', 'Ojos-Albos', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05174', 'Orbita', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05175', 'El Oso', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05176', 'Padiernos', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05177', 'Pajares de Adaja', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05178', 'Palacios de Goda', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05179', 'Papatrigo', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05180', 'El Parral', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05181', 'Pascualcobo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05182', 'Pedro Bernardo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05183', 'Pedro-Rodríguez', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05184', 'Peguerinos', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05185', 'Peñalba de Ávila', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05186', 'Piedrahíta', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05187', 'Piedralaves', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05188', 'Poveda', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05189', 'Poyales del Hoyo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05190', 'Pozanco', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05191', 'Pradosegar', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05192', 'Puerto Castilla', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05193', 'Rasueros', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05194', 'Riocabado', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05195', 'Riofrío', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05196', 'Rivilla de Barajas', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05197', 'Salobral', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05198', 'Salvadiós', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05199', 'San Bartolomé de Béjar', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05201', 'San Bartolomé de Pinares', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05204', 'Sanchidrián', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05205', 'Sanchorreja', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05206', 'San Esteban de los Patos', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05207', 'San Esteban del Valle', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05208', 'San Esteban de Zapardiel', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05209', 'San García de Ingelmos', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05210', 'San Juan de la Encinilla', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05211', 'San Juan de la Nava', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05212', 'San Juan del Molinillo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05213', 'San Juan del Olmo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05214', 'San Lorenzo de Tormes', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05215', 'San Martín de la Vega del Alberche', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05216', 'San Martín del Pimpollar', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05218', 'San Miguel de Serrezuela', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05219', 'San Pascual', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05220', 'San Pedro del Arroyo', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05221', 'Santa Cruz del Valle', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05222', 'Santa Cruz de Pinares', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05224', 'Santa María del Arroyo', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05225', 'Santa María del Berrocal', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05226', 'Santa María de los Caballeros', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05227', 'Santa María del Tiétar', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05228', 'Santiago del Collado', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05229', 'Santo Domingo de las Posadas', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05230', 'Santo Tomé de Zabarcos', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05231', 'San Vicente de Arévalo', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05232', 'La Serrada', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05233', 'Serranillos', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05234', 'Sigeres', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05235', 'Sinlabajos', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05236', 'Solana de Ávila', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05237', 'Solana de Rioalmar', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05238', 'Solosancho', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05239', 'Sotalbo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05240', 'Sotillo de la Adrada', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05241', 'El Tiemblo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05242', 'Tiñosillos', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05243', 'Tolbaños', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05244', 'Tormellas', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05245', 'Tornadizos de Ávila', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05246', 'Tórtoles', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05247', 'La Torre', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05249', 'Umbrías', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05251', 'Vadillo de la Sierra', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05252', 'Valdecasa', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05253', 'Vega de Santa María', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05254', 'Velayos', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05256', 'Villaflor', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05257', 'Villafranca de la Sierra', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05258', 'Villanueva de Gómez', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05259', 'Villanueva del Aceral', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05260', 'Villanueva del Campillo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05262', 'Villarejo del Valle', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05263', 'Villatoro', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05264', 'Viñegra de Moraña', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05265', 'Vita', '05', 'Ávila', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05266', 'Zapardiel de la Cañada', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05267', 'Zapardiel de la Ribera', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05901', 'San Juan de Gredos', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05902', 'Santa María del Cubillo', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05903', 'Diego del Carpio', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05904', 'Santiago del Tormes', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('05905', 'Villanueva de Ávila', '05', 'Ávila', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06001', 'Acedera', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06003', 'Ahillones', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06004', 'Alange', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06006', 'Alburquerque', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06007', 'Alconchel', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06008', 'Alconera', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06009', 'Aljucén', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06010', 'Almendral', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06011', 'Almendralejo', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06013', 'Atalaya', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06014', 'Azuaga', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06015', 'Badajoz', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06016', 'Barcarrota', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06017', 'Baterno', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06018', 'Benquerencia de la Serena', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06019', 'Berlanga', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06022', 'Burguillos del Cerro', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06023', 'Cabeza del Buey', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06024', 'Cabeza la Vaca', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06026', 'Calera de León', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06027', 'Calzadilla de los Barros', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06028', 'Campanario', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06029', 'Campillo de Llerena', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06030', 'Capilla', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06031', 'Carmonita', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06032', 'El Carrascalejo', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06033', 'Casas de Don Pedro', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06034', 'Casas de Reina', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06035', 'Castilblanco', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06036', 'Castuera', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06037', 'La Codosera', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06038', 'Cordobilla de Lácara', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06039', 'La Coronada', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06040', 'Corte de Peleas', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06041', 'Cristina', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06042', 'Cheles', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06043', 'Don Álvaro', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06045', 'Entrín Bajo', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06046', 'Esparragalejo', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06047', 'Esparragosa de la Serena', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06048', 'Esparragosa de Lares', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06049', 'Feria', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06051', 'Fuenlabrada de los Montes', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06052', 'Fuente de Cantos', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06054', 'Fuente del Maestre', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06055', 'Fuentes de León', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06056', 'Garbayuela', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06057', 'Garlitos', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06058', 'La Garrovilla', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06059', 'Granja de Torrehermosa', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06060', 'Guareña', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06061', 'La Haba', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06062', 'Helechosa de los Montes', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06063', 'Herrera del Duque', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06064', 'Higuera de la Serena', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06065', 'Higuera de Llerena', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06066', 'Higuera de Vargas', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06067', 'Higuera la Real', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06069', 'Hornachos', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06070', 'Jerez de los Caballeros', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06071', 'La Lapa', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06072', 'Lobón', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06073', 'Llera', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06075', 'Magacela', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06076', 'Maguilla', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06077', 'Malcocinado', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06078', 'Malpartida de la Serena', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06079', 'Manchita', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06080', 'Medellín', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06081', 'Medina de las Torres', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06083', 'Mérida', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06084', 'Mirandilla', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06085', 'Monesterio', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06086', 'Montemolín', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06087', 'Monterrubio de la Serena', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06088', 'Montijo', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06089', 'La Morera', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06091', 'Navalvillar de Pela', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06092', 'Nogales', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06093', 'Oliva de la Frontera', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06094', 'Oliva de Mérida', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06095', 'Olivenza', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06096', 'Orellana de la Sierra', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06097', 'Orellana la Vieja', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06098', 'Palomas', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06099', 'La Parra', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06100', 'Peñalsordo', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06101', 'Peraleda del Zaucejo', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06102', 'Puebla de Alcocer', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06103', 'Puebla de la Calzada', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06105', 'Puebla del Maestre', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06106', 'Puebla del Prior', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06107', 'Puebla de Obando', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06108', 'Puebla de Sancho Pérez', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06109', 'Quintana de la Serena', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06110', 'Reina', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06111', 'Rena', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06114', 'Risco', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06115', 'La Roca de la Sierra', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06116', 'Salvaleón', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06117', 'Salvatierra de los Barros', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06118', 'Sancti-Spíritus', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06119', 'San Pedro de Mérida', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06121', 'Santa Marta', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06122', 'Los Santos de Maimona', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06123', 'San Vicente de Alcántara', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06124', 'Segura de León', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06125', 'Siruela', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06126', 'Solana de los Barros', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06127', 'Talarrubias', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06128', 'Talavera la Real', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06129', 'Táliga', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06130', 'Tamurejo', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06131', 'Torre de Miguel Sesmero', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06132', 'Torremayor', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06133', 'Torremejía', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06134', 'Trasierra', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06135', 'Trujillanos', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06136', 'Usagre', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06137', 'Valdecaballeros', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06138', 'Valdetorres', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06140', 'Valencia del Mombuey', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06141', 'Valencia del Ventoso', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06142', 'Valverde de Burguillos', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06144', 'Valverde de Llerena', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06145', 'Valverde de Mérida', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06146', 'Valle de la Serena', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06147', 'Valle de Matamoros', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06149', 'Villafranca de los Barros', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06151', 'Villagonzalo', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06153', 'Villanueva de la Serena', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06154', 'Villanueva del Fresno', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06155', 'Villar del Rey', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06156', 'Villar de Rena', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06157', 'Villarta de los Montes', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06158', 'Zafra', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06159', 'Zahínos', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06160', 'Zalamea de la Serena', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06161', 'Zarza-Capilla', '06', 'Badajoz', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06162', 'La Zarza', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06901', 'Valdelacalzada', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06902', 'Pueblonuevo del Guadiana', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('06903', 'Guadiana', '06', 'Badajoz', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07001', 'Alaró', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07006', 'Artà', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07010', 'Bunyola', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07014', 'Capdepera', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07018', 'Deià', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07020', 'Esporles', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07022', 'Felanitx', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07023', 'Ferreries', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07025', 'Fornalutx', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07028', 'Lloret de Vistalegre', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07029', 'Lloseta', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07033', 'Manacor', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07038', 'Montuïri', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07046', 'Sant Antoni de Portmany', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07049', 'Sant Joan', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07050', 'Sant Joan de Labritja', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07051', 'Sant Llorenç des Cardassar', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07054', 'Santa Eulària des Riu', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07058', 'Selva', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07059', 'Ses Salines', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07060', 'Sineu', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07061', 'Sóller', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07062', 'Son Servera', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07063', 'Valldemossa', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('07902', 'Es Migjorn Gran', '07', 'Illes Balears', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08001', 'Abrera', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08003', 'Alella', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08005', 'L''Ametlla del Vallès', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08006', 'Arenys de Mar', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08007', 'Arenys de Munt', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08009', 'Argentona', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08010', 'Artés', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08012', 'Avinyó', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08014', 'Aiguafreda', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08015', 'Badalona', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08016', 'Bagà', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08017', 'Balenyà', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08018', 'Balsareny', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08019', 'Barcelona', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08023', 'Bigues i Riells del Fai', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08026', 'El Brull', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08029', 'Cabrera de Mar', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08030', 'Cabrils', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08032', 'Caldes d''Estrac', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08033', 'Caldes de Montbui', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08035', 'Calella', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08037', 'Calldetenes', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08038', 'Callús', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08039', 'Campins', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08040', 'Canet de Mar', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08041', 'Canovelles', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08046', 'Cardedeu', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08051', 'Castellar del Vallès', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08052', 'Castellar de n''Hug', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08054', 'Castellbisbal', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08060', 'Castellfollit de Riubregós', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08061', 'Castellgalí', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08067', 'Centelles', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08068', 'Cervelló', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08072', 'Corbera de Llobregat', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08073', 'Cornellà de Llobregat', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08075', 'Dosrius', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08076', 'Esparreguera', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08077', 'Esplugues de Llobregat', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08081', 'Fogars de Montclús', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08082', 'Fogars de la Selva', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08083', 'Folgueroles', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08086', 'Les Franqueses del Vallès', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08088', 'La Garriga', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08091', 'Gelida', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08093', 'Gisclareny', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08096', 'Granollers', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08097', 'Gualba', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08099', 'Guardiola de Berguedà', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08100', 'Gurb', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08101', 'L''Hospitalet de Llobregat', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08105', 'La Llagosta', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08106', 'Llinars del Vallès', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08107', 'Lliçà d''Amunt', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08108', 'Lliçà de Vall', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08110', 'Malgrat de Mar', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08111', 'Malla', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08112', 'Manlleu', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08113', 'Manresa', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08114', 'Martorell', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08115', 'Martorelles', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08116', 'Les Masies de Roda', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08117', 'Les Masies de Voltregà', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08118', 'El Masnou', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08120', 'Matadepera', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08121', 'Mataró', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08123', 'Molins de Rei', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08124', 'Mollet del Vallès', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08125', 'Montcada i Reixac', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08126', 'Montgat', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08128', 'Monistrol de Calders', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08131', 'Montesquiu', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08134', 'Figaró-Montmany', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08135', 'Montmeló', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08136', 'Montornès del Vallès', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08140', 'Navarcles', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08141', 'Navàs', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08147', 'Olesa de Montserrat', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08150', 'Orís', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08153', 'Òrrius', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08155', 'Palafolls', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08156', 'Palau-solità i Plegamans', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08157', 'Pallejà', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08158', 'El Papiol', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08159', 'Parets del Vallès', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08163', 'Pineda de Mar', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08166', 'La Pobla de Lillet', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08167', 'Polinyà', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08169', 'El Prat de Llobregat', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08172', 'Premià de Mar', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08180', 'Ripollet', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08181', 'La Roca del Vallès', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08182', 'El Pont de Vilomara i Rocafort', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08183', 'Roda de Ter', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08184', 'Rubí', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08187', 'Sabadell', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08190', 'Saldes', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08191', 'Sallent', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08193', 'Sant Iscle de Vallalta', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08194', 'Sant Adrià de Besòs', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08196', 'Sant Andreu de la Barca', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08197', 'Sant Andreu de Llavaneres', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08200', 'Sant Boi de Llobregat', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08202', 'Sant Celoni', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08203', 'Sant Cebrià de Vallalta', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08205', 'Sant Cugat del Vallès', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08207', 'Sant Esteve de Palautordera', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08209', 'Sant Fost de Campsentelles', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08210', 'Sant Feliu de Codines', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08211', 'Sant Feliu de Llobregat', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08214', 'Vilassar de Dalt', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08217', 'Sant Joan Despí', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08218', 'Sant Joan de Vilatorrada', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08219', 'Vilassar de Mar', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08220', 'Sant Julià de Vilatorta', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08221', 'Sant Just Desvern', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08223', 'Sant Llorenç Savall', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08224', 'Sant Martí de Centelles', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08229', 'Sant Mateu de Bages', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08230', 'Premià de Dalt', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08233', 'Sant Pere de Torelló', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08234', 'Sant Pere de Vilamajor', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08235', 'Sant Pol de Mar', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08237', 'Sant Quirze de Besora', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08238', 'Sant Quirze del Vallès', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08241', 'Sant Sadurní d''Osormort', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08244', 'Santa Coloma de Cervelló', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08245', 'Santa Coloma de Gramenet', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08246', 'Santa Eugènia de Berga', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08248', 'Santa Eulàlia de Ronçana', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08252', 'Barberà del Vallès', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08256', 'Santa Maria de Martorelles', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08259', 'Santa Maria de Palautordera', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08260', 'Santa Perpètua de Mogoda', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08261', 'Santa Susanna', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08262', 'Sant Vicenç de Castellet', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08263', 'Sant Vicenç dels Horts', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08264', 'Sant Vicenç de Montalt', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08265', 'Sant Vicenç de Torelló', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08266', 'Cerdanyola del Vallès', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08267', 'Sentmenat', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08269', 'Seva', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08274', 'Súria', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08275', 'Tavèrnoles', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08278', 'Taradell', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08279', 'Terrassa', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08281', 'Teià', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08282', 'Tiana', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08283', 'Tona', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08284', 'Tordera', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08285', 'Torelló', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08294', 'Vallgorguina', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08296', 'Vallromanes', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08298', 'Vic', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08300', 'Viladecavalls', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08301', 'Viladecans', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08303', 'Vilanova de Sau', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08306', 'Vilalba Sasserra', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08902', 'Vilanova del Vallès', '08', 'Barcelona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08903', 'Sant Julià de Cerdanyola', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08904', 'Badia del Vallès', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('08905', 'La Palma de Cervelló', '08', 'Barcelona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09010', 'Alcocero de Mola', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09026', 'Arlanzón', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09027', 'Arraya de Oca', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09029', 'Atapuerca', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09030', 'Los Ausines', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09036', 'Bañuelos de Bureba', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09038', 'Barbadillo del Mercado', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09039', 'Barbadillo del Pez', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09044', 'Barrios de Colina', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09046', 'Bascuñana', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09048', 'Belorado', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09055', 'Brazacorta', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09059', 'Burgos', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09066', 'Campolara', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09072', 'Carcedo de Burgos', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09074', 'Cardeñajimeno', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09075', 'Cardeñuela Riopico', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09076', 'Carrias', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09078', 'Cascajares de la Sierra', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09083', 'Castil de Peones', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09086', 'Castrillo del Val', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09091', 'Castrojeriz', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09094', 'Cebrecos', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09098', 'Cerezo de Río Tirón', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09100', 'Cerratón de Juarros', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09110', 'Contreras', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09113', 'Covarrubias', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09119', 'Cuevas de San Clemente', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09123', 'Espinosa del Camino', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09124', 'Espinosa de los Monteros', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09129', 'Fresneda de la Sierra Tirón', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09130', 'Fresneña', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09132', 'Fresno de Río Tirón', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09133', 'Fresno de Rodilla', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09169', 'Hortigüela', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09173', 'Huerta de Arriba', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09176', 'Hurones', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09177', 'Ibeas de Juarros', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09183', 'Jaramillo de la Fuente', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09184', 'Jaramillo Quemado', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09189', 'Junta de Traslaloma', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09191', 'Jurisdicción de Lara', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09200', 'Mambrillas de Lara', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09208', 'Mecerreyes', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09209', 'Medina de Pomar', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09214', 'Merindad de Montija', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09224', 'Monasterio de Rodilla', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09226', 'Monterrubio de la Demanda', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09231', 'Nebreda', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09232', 'Neila', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09241', 'Orbaneja Riopico', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09248', 'Palazuelos de la Sierra', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09257', 'Pedrosa del Páramo', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09258', 'Pedrosa del Príncipe', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09261', 'Peñaranda de Duero', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09266', 'Pineda de la Sierra', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09269', 'Pinilla de los Moros', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09273', 'Prádanos de Bureba', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09274', 'Pradoluengo', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09277', 'Puentedura', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09288', 'Quintanapalla', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09292', 'Quintanavides', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09298', 'Quintanilla San García', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09303', 'Rábanos', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09308', 'Redecilla del Campo', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09312', 'La Revilla y Ahedo', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09314', 'Revilla del Campo', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09318', 'Riocavado de la Sierra', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09326', 'Rubena', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09330', 'Salas de los Infantes', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09335', 'San Adrián de Juarros', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09340', 'San Millán de Lara', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09346', 'Santa Cruz del Valle Urbión', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09348', 'Santa Inés', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09351', 'Santa María del Invierno', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09354', 'Santa Olalla de Bureba', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09360', 'San Vicente del Valle', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09363', 'Sasamón', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09366', 'Solarana', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09381', 'Tinieblas de la Sierra', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09388', 'Torrelara', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09392', 'Tosantos', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09407', 'Valmala', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09408', 'Vallarta de Bureba', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09410', 'Valle de Mena', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09411', 'Valle de Oca', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09414', 'Valle de Valdelaguna', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09419', 'Valluércanes', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09424', 'Viloria de Rioja', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09429', 'Villaescusa la Sombría', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09430', 'Villaespasa', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09431', 'Villafranca Montes de Oca', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09433', 'Villagalijo', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09445', 'Villambistia', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09447', 'Villamiel de la Sierra', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09463', 'Villasur de Herreros', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09473', 'Villegas', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09476', 'Villoruebo', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09478', 'Vizcaínos', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('09901', 'Quintanilla del Agua y Tordueles', '09', 'Burgos', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10001', 'Abadía', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10002', 'Abertura', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10003', 'Acebo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10004', 'Acehúche', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10005', 'Aceituna', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10006', 'Ahigal', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10007', 'Albalá', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10008', 'Alcántara', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10009', 'Alcollarín', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10010', 'Alcuéscar', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10011', 'Aldeacentenera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10012', 'Aldea del Cano', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10013', 'La Aldea del Obispo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10014', 'Aldeanueva de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10015', 'Aldeanueva del Camino', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10017', 'Alía', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10018', 'Aliseda', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10020', 'Almoharín', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10021', 'Arroyo de la Luz', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10022', 'Arroyomolinos de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10023', 'Arroyomolinos', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10024', 'Baños de Montemayor', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10025', 'Barrado', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10026', 'Belvís de Monroy', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10027', 'Benquerencia', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10028', 'Berrocalejo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10029', 'Berzocana', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10030', 'Bohonal de Ibor', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10031', 'Botija', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10032', 'Brozas', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10033', 'Cabañas del Castillo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10034', 'Cabezabellosa', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10035', 'Cabezuela del Valle', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10036', 'Cabrero', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10037', 'Cáceres', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10039', 'Cadalso', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10040', 'Calzadilla', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10041', 'Caminomorisco', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10042', 'Campillo de Deleitosa', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10043', 'Campo Lugar', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10044', 'Cañamero', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10045', 'Cañaveral', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10046', 'Carbajo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10048', 'Carrascalejo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10049', 'Casar de Cáceres', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10050', 'Casar de Palomero', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10051', 'Casares de las Hurdes', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10052', 'Casas de Don Antonio', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10053', 'Casas de Don Gómez', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10054', 'Casas del Castañar', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10055', 'Casas del Monte', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10056', 'Casas de Millán', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10057', 'Casas de Miravete', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10059', 'Casillas de Coria', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10060', 'Castañar de Ibor', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10061', 'Ceclavín', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10062', 'Cedillo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10063', 'Cerezo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10064', 'Cilleros', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10065', 'Collado de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10066', 'Conquista de la Sierra', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10067', 'Coria', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10068', 'Cuacos de Yuste', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10069', 'La Cumbre', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10070', 'Deleitosa', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10071', 'Descargamaría', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10072', 'Eljas', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10073', 'Escurial', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10075', 'Fresnedoso de Ibor', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10077', 'Garciaz', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10078', 'La Garganta', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10079', 'Garganta la Olla', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10080', 'Gargantilla', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10081', 'Gargüera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10082', 'Garrovillas de Alconétar', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10083', 'Garvín', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10084', 'Gata', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10086', 'La Granja', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10087', 'Guadalupe', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10088', 'Guijo de Coria', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10089', 'Guijo de Galisteo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10090', 'Guijo de Granadilla', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10091', 'Guijo de Santa Bárbara', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10092', 'Herguijuela', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10093', 'Hernán-Pérez', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10094', 'Herrera de Alcántara', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10095', 'Herreruela', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10096', 'Hervás', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10097', 'Higuera de Albalat', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10098', 'Hinojal', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10099', 'Holguera', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10100', 'Hoyos', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10101', 'Huélaga', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10102', 'Ibahernando', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10103', 'Jaraicejo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10104', 'Jaraíz de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10105', 'Jarandilla de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10106', 'Jarilla', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10107', 'Jerte', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10108', 'Ladrillar', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10109', 'Logrosán', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10110', 'Losar de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10111', 'Madrigal de la Vera', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10112', 'Madrigalejo', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10113', 'Madroñera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10115', 'Malpartida de Cáceres', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10116', 'Malpartida de Plasencia', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10117', 'Marchagaz', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10118', 'Mata de Alcántara', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10119', 'Membrío', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10120', 'Mesas de Ibor', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10121', 'Miajadas', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10122', 'Millanes', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10123', 'Mirabel', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10124', 'Mohedas de Granadilla', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10125', 'Monroy', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10126', 'Montánchez', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10127', 'Montehermoso', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10128', 'Moraleja', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10130', 'Navaconcejo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10131', 'Navalmoral de la Mata', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10132', 'Navalvillar de Ibor', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10133', 'Navas del Madroño', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10134', 'Navezuelas', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10135', 'Nuñomoral', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10136', 'Oliva de Plasencia', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10137', 'Palomero', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10138', 'Pasarón de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10139', 'Pedroso de Acim', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10141', 'Peraleda de San Román', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10142', 'Perales del Puerto', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10143', 'Pescueza', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10144', 'La Pesga', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10145', 'Piedras Albas', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10146', 'Pinofranqueado', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10147', 'Piornal', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10148', 'Plasencia', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10149', 'Plasenzuela', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10150', 'Portaje', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10151', 'Portezuelo', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10152', 'Pozuelo de Zarzón', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10153', 'Puerto de Santa Cruz', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10154', 'Rebollar', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10156', 'Robledillo de Gata', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10157', 'Robledillo de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10158', 'Robledillo de Trujillo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10159', 'Robledollano', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10160', 'Romangordo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10161', 'Ruanes', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10162', 'Salorino', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10163', 'Salvatierra de Santiago', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10164', 'San Martín de Trevejo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10165', 'Santa Ana', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10166', 'Santa Cruz de la Sierra', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10167', 'Santa Cruz de Paniagua', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10168', 'Santa Marta de Magasca', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10169', 'Santiago de Alcántara', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10170', 'Santiago del Campo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10171', 'Santibáñez el Alto', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10172', 'Santibáñez el Bajo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10174', 'Segura de Toro', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10175', 'Serradilla', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10176', 'Serrejón', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10177', 'Sierra de Fuentes', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10178', 'Talaván', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10179', 'Talaveruela de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10180', 'Talayuela', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10181', 'Tejeda de Tiétar', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10183', 'Tornavacas', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10184', 'El Torno', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10185', 'Torrecilla de los Ángeles', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10186', 'Torrecillas de la Tiesa', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10187', 'Torre de Don Miguel', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10188', 'Torre de Santa María', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10189', 'Torrejoncillo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10190', 'Torrejón el Rubio', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10191', 'Torremenga', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10192', 'Torremocha', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10193', 'Torreorgaz', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10194', 'Torrequemada', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10195', 'Trujillo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10196', 'Valdastillas', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10197', 'Valdecañas de Tajo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10198', 'Valdefuentes', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10199', 'Valdehúncar', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10200', 'Valdelacasa de Tajo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10201', 'Valdemorales', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10202', 'Valdeobispo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10203', 'Valencia de Alcántara', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10204', 'Valverde de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10205', 'Valverde del Fresno', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10206', 'Viandar de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10207', 'Villa del Campo', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10208', 'Villa del Rey', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10209', 'Villamesías', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10210', 'Villamiel', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10211', 'Villanueva de la Sierra', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10212', 'Villanueva de la Vera', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10213', 'Villar del Pedroso', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10214', 'Villar de Plasencia', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10215', 'Villasbuenas de Gata', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10216', 'Zarza de Granadilla', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10217', 'Zarza de Montánchez', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10218', 'Zarza la Mayor', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10219', 'Zorita', '10', 'Cáceres', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10902', 'Vegaviana', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10903', 'Alagón del Río', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('10905', 'Pueblonuevo de Miramontes', '10', 'Cáceres', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12006', 'Alcudia de Veo', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12008', 'Algimia de Almonacid', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12010', 'Almedíjar', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12013', 'Arañuel', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12018', 'Azuébar', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12041', 'Castillo de Villamalefa', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12056', 'Chóvar', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12065', 'Gaibiel', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12069', 'Higueras', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12076', 'Matet', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12088', 'Pavías', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12116', 'Torralba del Pinar', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12125', 'Vall de Almonacid', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('12142', 'Zucaina', '12', 'Castellón/Castelló', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13001', 'Abenójar', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13002', 'Agudo', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13003', 'Alamillo', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13004', 'Albaladejo', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13006', 'Alcoba', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13011', 'Almadén', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13012', 'Almadenejos', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13014', 'Almedina', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13015', 'Almodóvar del Campo', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13016', 'Almuradiel', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13017', 'Anchuras', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13021', 'Arroba de los Montes', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13024', 'Brazatortas', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13025', 'Cabezarados', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13026', 'Cabezarrubias del Puerto', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13027', 'Calzada de Calatrava', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13033', 'Castellar de Santiago', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13036', 'Los Cortijos', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13037', 'Cózar', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13038', 'Chillón', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13040', 'Fernán Caballero', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13041', 'Fontanarejo', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13042', 'Fuencaliente', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13044', 'Fuente el Fresno', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13046', 'Guadalmez', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13048', 'Hinojosas de Calatrava', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13049', 'Horcajo de los Montes', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13050', 'Las Labores', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13052', 'Malagón', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13055', 'Mestanza', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13059', 'Navalpino', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13060', 'Navas de Estena', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13063', 'Piedrabuena', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13065', 'Porzuna', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13068', 'Puebla de Don Rodrigo', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13069', 'Puebla del Príncipe', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13070', 'Puerto Lápice', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13071', 'Puertollano', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13072', 'Retuerta del Bullaque', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13073', 'Saceruela', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13075', 'San Lorenzo de Calatrava', '13', 'Ciudad Real', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13076', 'Santa Cruz de los Cáñamos', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13077', 'Santa Cruz de Mudela', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13080', 'Solana del Pino', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13081', 'Terrinches', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13084', 'Torre de Juan Abad', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13085', 'Torrenueva', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13086', 'Valdemanco del Esteras', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13090', 'Villamanrique', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13093', 'Villanueva de los Infantes', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13096', 'Villarrubia de los Ojos', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13097', 'Villarta de San Juan', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13098', 'Viso del Marqués', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('13901', 'El Robledo', '13', 'Ciudad Real', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14003', 'Alcaracejos', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14005', 'Almodóvar del Río', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14006', 'Añora', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14008', 'Belalcázar', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14009', 'Belmez', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14011', 'Los Blázquez', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14016', 'Cardeña', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14020', 'Conquista', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14021', 'Córdoba', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14023', 'Dos Torres', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14026', 'Espiel', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14028', 'Fuente la Lancha', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14029', 'Fuente Obejuna', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14032', 'La Granjuela', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14034', 'El Guijo', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14035', 'Hinojosa del Duque', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14036', 'Hornachuelos', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14047', 'Obejo', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14049', 'Palma del Río', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14051', 'Pedroche', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14052', 'Peñarroya-Pueblonuevo', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14053', 'Posadas', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14054', 'Pozoblanco', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14061', 'Santa Eufemia', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14062', 'Torrecampo', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14064', 'Valsequillo', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14067', 'Villafranca de Córdoba', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14068', 'Villaharta', '14', 'Córdoba', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14069', 'Villanueva de Córdoba', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14070', 'Villanueva del Duque', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14071', 'Villanueva del Rey', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14072', 'Villaralto', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('14074', 'El Viso', '14', 'Córdoba', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15001', 'Abegondo', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15002', 'Ames', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15003', 'Aranga', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15004', 'Ares', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15005', 'Arteixo', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15006', 'Arzúa', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15007', 'A Baña', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15008', 'Bergondo', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15009', 'Betanzos', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15010', 'Boimorto', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15011', 'Boiro', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15012', 'Boqueixón', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15013', 'Brión', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15014', 'Cabana de Bergantiños', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15015', 'Cabanas', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15016', 'Camariñas', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15017', 'Cambre', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15018', 'A Capela', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15019', 'Carballo', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15020', 'Carnota', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15021', 'Carral', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15022', 'Cedeira', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15023', 'Cee', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15024', 'Cerceda', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15027', 'Coirós', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15028', 'Corcubión', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15029', 'Coristanco', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15030', 'A Coruña', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15031', 'Culleredo', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15032', 'Curtis', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15033', 'Dodro', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15034', 'Dumbría', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15035', 'Fene', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15036', 'Ferrol', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15037', 'Fisterra', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15038', 'Frades', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15039', 'Irixoa', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15040', 'Laxe', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15041', 'A Laracha', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15042', 'Lousame', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15043', 'Malpica de Bergantiños', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15044', 'Mañón', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15045', 'Mazaricos', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15046', 'Melide', '15', 'A Coruña', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15047', 'Mesía', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15048', 'Miño', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15049', 'Moeche', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15050', 'Monfero', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15051', 'Mugardos', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15052', 'Muxía', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15053', 'Muros', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15054', 'Narón', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15055', 'Neda', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15056', 'Negreira', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15057', 'Noia', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15058', 'Oleiros', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15059', 'Ordes', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15060', 'Oroso', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15061', 'Ortigueira', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15062', 'Outes', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15064', 'Paderne', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15065', 'Padrón', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15066', 'O Pino', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15067', 'A Pobra do Caramiñal', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15068', 'Ponteceso', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15069', 'Pontedeume', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15070', 'As Pontes de García Rodríguez', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15071', 'Porto do Son', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15072', 'Rianxo', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15073', 'Ribeira', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15074', 'Rois', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15075', 'Sada', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15076', 'San Sadurniño', '15', 'A Coruña', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15077', 'Santa Comba', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15078', 'Santiago de Compostela', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15079', 'Santiso', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15082', 'Teo', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15083', 'Toques', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15084', 'Tordoia', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15085', 'Touro', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15086', 'Trazo', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15087', 'Valdoviño', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15088', 'Val do Dubra', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15089', 'Vedra', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15090', 'Vilasantar', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15091', 'Vilarmaior', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15092', 'Vimianzo', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15093', 'Zas', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15901', 'Cariño', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('15902', 'Oza-Cesuras', '15', 'A Coruña', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16024', 'Arguisuelas', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16031', 'Beamud', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16044', 'Campillos-Sierra', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16055', 'Carboneras de Guadazaón', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16056', 'Cardenete', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16065', 'Casas de los Pinos', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16089', 'Fuentes', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16095', 'Graja de Campalbo', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16097', 'Henarejos', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16111', 'Huerta del Marquesado', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16115', 'Laguna del Marquesado', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16117', 'Landete', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16131', 'Monteagudo de las Salinas', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16133', 'Mota del Cuervo', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16145', 'Osa de la Vega', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16177', 'Reíllo', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16190', 'San Clemente', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16194', 'Santa Cruz de Moya', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16202', 'Talayuelas', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16224', 'Valdemeca', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('16227', 'Valdemoro-Sierra', '16', 'Cuenca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17001', 'Agullana', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17002', 'Aiguaviva', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17003', 'Albanyà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17005', 'El Far d''Empordà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17006', 'Alp', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17007', 'Amer', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17008', 'Anglès', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17009', 'Arbúcies', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17010', 'Argelaguer', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17011', 'L''Armentera', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17013', 'Begur', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17014', 'La Vajol', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17015', 'Banyoles', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17019', 'Besalú', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17020', 'Bescanó', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17021', 'Beuda', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17022', 'La Bisbal d''Empordà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17023', 'Blanes', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17024', 'Bolvir', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17025', 'Bordils', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17027', 'Breda', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17028', 'Brunyola i Sant Martí Sapresa', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17029', 'Boadella i les Escaules', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17030', 'Cabanes', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17031', 'Cabanelles', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17032', 'Cadaqués', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17033', 'Caldes de Malavella', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17034', 'Calonge i Sant Antoni', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17035', 'Camós', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17036', 'Campdevànol', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17037', 'Campelles', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17038', 'Campllong', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17039', 'Camprodon', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17040', 'Canet d''Adri', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17041', 'Cantallops', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17042', 'Capmany', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17043', 'Queralbs', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17044', 'Cassà de la Selva', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17047', 'Castelló d''Empúries', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17048', 'Castell d''Aro, Platja d''Aro i s''Agaró', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17049', 'Celrà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17050', 'Cervià de Ter', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17051', 'Cistella', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17052', 'Siurana', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17054', 'Colera', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17056', 'Cornellà del Terri', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17057', 'Corçà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17060', 'Darnius', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17061', 'Das', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17062', 'L''Escala', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17063', 'Espinelves', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17064', 'Espolla', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17066', 'Figueres', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17067', 'Flaçà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17068', 'Foixà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17069', 'Fontanals de Cerdanya', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17071', 'Fontcoberta', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17074', 'Fortià', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17077', 'Garriguella', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17078', 'Ger', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17079', 'Girona', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17080', 'Gombrèn', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17082', 'Guils de Cerdanya', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17083', 'Hostalric', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17084', 'Isòvol', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17086', 'La Jonquera', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17087', 'Juià', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17089', 'Llagostera', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17090', 'Llambilles', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17091', 'Llanars', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17092', 'Llançà', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17093', 'Llers', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17094', 'Llívia', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17095', 'Lloret de Mar', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17096', 'Les Llosses', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17097', 'Madremanya', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17098', 'Maià de Montcal', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17099', 'Meranges', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17100', 'Masarac i Vilarnadal', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17101', 'Massanes', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17102', 'Maçanet de Cabrenys', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17103', 'Maçanet de la Selva', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17105', 'Mieres', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17106', 'Mollet de Peralada', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17107', 'Molló', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17109', 'Montagut i Oix', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17110', 'Mont-ras', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17111', 'Navata', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17112', 'Ogassa', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17114', 'Olot', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17116', 'Osor', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17117', 'Palafrugell', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17118', 'Palamós', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17120', 'Palau-saverdera', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17121', 'Palau-sator', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17123', 'Palol de Revardit', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17124', 'Pals', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17125', 'Pardines', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17126', 'Parlavà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17128', 'Pau', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17129', 'Pedret i Marzà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17130', 'La Pera', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17132', 'Peralada', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17133', 'Les Planes d''Hostoles', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17134', 'Planoles', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17135', 'Pont de Molins', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17137', 'Porqueres', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17138', 'Portbou', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17139', 'Les Preses', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17140', 'El Port de la Selva', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17141', 'Puigcerdà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17142', 'Quart', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17143', 'Rabós', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17144', 'Regencós', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17145', 'Ribes de Freser', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17146', 'Riells i Viabrea', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17147', 'Ripoll', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17148', 'Riudarenes', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17149', 'Riudaura', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17150', 'Riudellots de la Selva', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17151', 'Riumors', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17152', 'Roses', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17153', 'Rupià', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17155', 'Salt', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17158', 'Sant Climent Sescebes', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17159', 'Sant Feliu de Buixalleu', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17160', 'Sant Feliu de Guíxols', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17161', 'Sant Feliu de Pallerols', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17162', 'Sant Ferriol', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17163', 'Sant Gregori', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17164', 'Sant Hilari Sacalm', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17165', 'Sant Jaume de Llierca', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17166', 'Sant Jordi Desvalls', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17167', 'Sant Joan de les Abadesses', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17168', 'Sant Joan de Mollet', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17169', 'Sant Julià de Ramis', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17170', 'Vallfogona de Ripollès', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17171', 'Sant Llorenç de la Muga', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17172', 'Sant Martí de Llémena', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17173', 'Sant Martí Vell', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17174', 'Sant Miquel de Campmajor', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17177', 'Sant Pau de Segúries', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17178', 'Sant Pere Pescador', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17180', 'Santa Coloma de Farners', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17181', 'Santa Cristina d''Aro', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17183', 'Sant Aniol de Finestres', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17184', 'Santa Pau', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17186', 'Sarrià de Ter', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17188', 'La Selva de Mar', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17189', 'La Cellera de Ter', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17190', 'Serinyà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17192', 'Setcases', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17193', 'Sils', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17194', 'Susqueda', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17197', 'Torrent', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17198', 'Torroella de Fluvià', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17200', 'Tortellà', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17201', 'Toses', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17202', 'Tossa de Mar', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17205', 'Ullastret', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17206', 'Urús', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17207', 'La Vall d''en Bas', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17208', 'La Vall de Bianya', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17209', 'Vall-llobrega', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17210', 'Ventalló', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17213', 'Vidreres', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17214', 'Vilabertran', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17215', 'Vilablareix', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17220', 'Viladrau', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17221', 'Vilafant', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17223', 'Vilajuïga', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17224', 'Vilallonga de Ter', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17225', 'Vilamacolum', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17226', 'Vilamalla', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17227', 'Vilamaniscle', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17228', 'Vilanant', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17230', 'Vila-sacra', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17233', 'Vilobí d''Onyar', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17234', 'Biure', '17', 'Girona', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17901', 'Cruïlles, Monells i Sant Sadurní de l''Heura', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17902', 'Forallac', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('17903', 'Sant Julià del Llor i Bonmatí', '17', 'Girona', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18004', 'Albondón', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18005', 'Albuñán', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18006', 'Albuñol', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18010', 'Aldeire', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18016', 'Almegíjar', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18017', 'Almuñécar', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18018', 'Alquife', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18023', 'Baza', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18030', 'Bérchules', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18032', 'Bubión', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18033', 'Busquístar', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18035', 'Cádiar', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18039', 'Caniles', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18042', 'Capileira', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18044', 'Cástaras', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18047', 'Cenes de la Vega', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18049', 'Cogollos de Guadix', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18069', 'Dólar', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18074', 'Ferreira', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18085', 'Gor', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18089', 'Guadix', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18094', 'Güéjar Sierra', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18097', 'Huéneja', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18103', 'Ítrabo', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18108', 'Jérez del Marquesado', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18109', 'Jete', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18112', 'Juviles', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18114', 'La Calahorra', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18117', 'Lanteira', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18121', 'Lobras', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18123', 'Lugros', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18124', 'Lújar', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18134', 'Monachil', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18141', 'Murtas', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18148', 'Otívar', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18151', 'Pampaneira', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18157', 'Pinos Genil', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18162', 'Polopos', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18163', 'Pórtugos', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18168', 'Quéntar', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18170', 'Rubite', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18173', 'Salobreña', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18176', 'Soportújar', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18177', 'Sorvilán', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18179', 'Torvizcón', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18180', 'Trevélez', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18181', 'Turón', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18182', 'Ugíjar', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18183', 'Válor', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18901', 'La Taha', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18903', 'Nevada', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18904', 'Alpujarra de la Sierra', '18', 'Granada', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('18907', 'Valle del Zalabí', '18', 'Granada', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19011', 'Alcolea del Pinar', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19013', 'Alcoroches', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19024', 'Alovera', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19027', 'Alustante', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19031', 'Angón', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19034', 'Anquela del Pedregal', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19037', 'Arbancón', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19039', 'Argecilla', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19042', 'Arroyo de las Fraguas', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19044', 'Atienza', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19046', 'Azuqueca de Henares', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19049', 'Bañuelos', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19052', 'La Bodera', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19057', 'Bustares', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19058', 'Cabanillas del Campo', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19059', 'Campillo de Dueñas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19060', 'Campillo de Ranas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19061', 'Campisábalos', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19065', 'Cantalojas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19067', 'El Cardoso de la Sierra', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19070', 'Casa de Uceda', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19071', 'El Casar', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19087', 'Cincovillas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19092', 'Cogolludo', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19096', 'Condemios de Arriba', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19097', 'Congostrina', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19102', 'El Cubillo de Uceda', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19103', 'Checa', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19105', 'Chiloeches', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19113', 'Espinosa de Henares', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19115', 'Establés', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19116', 'Estriégana', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19117', 'Fontanar', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19120', 'Fuentelahiguera de Albatages', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19126', 'Galápagos', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19127', 'Galve de Sorbe', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19129', 'Gascueña de Bornova', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19130', 'Guadalajara', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19132', 'Henche', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19133', 'Heras de Ayuso', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19135', 'Hiendelaencina', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19138', 'Hita', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19139', 'Hombrados', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19146', 'La Huerce', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19151', 'Humanes', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19156', 'Jadraque', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19157', 'Jirueque', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19159', 'Ledanca', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19165', 'Majaelrayo', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19166', 'Málaga del Fresno', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19167', 'Malaguilla', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19170', 'Maranchón', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19171', 'Marchamalo', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19173', 'Matarrubia', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19174', 'Matillas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19177', 'Medranda', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19179', 'Membrillera', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19181', 'Miedes de Atienza', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19182', 'La Mierla', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19185', 'La Miñosa', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19188', 'Mochales', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19189', 'Mohernando', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19191', 'Monasterio', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19195', 'Morenilla', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19197', 'Las Navas de Jadraque', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19202', 'La Olmeda de Jadraque', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19203', 'El Ordial', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19204', 'Orea', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19208', 'Pálmaces de Jadraque', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19213', 'El Pedregal', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19218', 'Pinilla de Jadraque', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19222', 'El Pobo de Dueñas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19226', 'Prádena de Atienza', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19228', 'Puebla de Beleña', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19229', 'Puebla de Valles', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19230', 'Quer', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19231', 'Rebollosa de Jadraque', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19234', 'Retiendas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19238', 'Riofrío del Llano', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19239', 'Robledillo de Mohernando', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19240', 'Robledo de Corpes', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19248', 'San Andrés del Congosto', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19251', 'Saúca', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19255', 'Setiles', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19257', 'Sigüenza', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19259', 'Somolinos', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19262', 'Tamajón', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19265', 'Tartanedo', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19270', 'Tordelrábano', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19272', 'Tordesilos', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19279', 'Torre del Burgo', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19280', 'Torrejón del Rey', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19282', 'Torremocha del Campo', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19285', 'Torrubia', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19288', 'Tortuero', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19293', 'Uceda', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19298', 'Valdearenas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19300', 'Valdeaveruelo', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19304', 'Valdenuño Fernández', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19305', 'Valdepeñas de la Sierra', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19307', 'Valdesotos', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19311', 'Valverde de los Arroyos', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19319', 'Villanueva de la Torre', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19321', 'Villares de Jadraque', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19322', 'Villaseca de Henares', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19323', 'Villaseca de Uceda', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19325', 'Viñuelas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19331', 'Yunquera de Henares', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19332', 'La Yunta', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19334', 'Zarzuela de Jadraque', '19', 'Guadalajara', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('19901', 'Semillas', '19', 'Guadalajara', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20001', 'Abaltzisketa', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20003', 'Aizarnazabal', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20004', 'Albiztur', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20005', 'Alegia', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20006', 'Alkiza', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20007', 'Altzo', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20008', 'Amezketa', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20010', 'Anoeta', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20012', 'Arama', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20013', 'Aretxabaleta', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20014', 'Asteasu', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20015', 'Ataun', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20016', 'Aia', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20017', 'Azkoitia', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20018', 'Azpeitia', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20019', 'Beasain', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20020', 'Beizama', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20021', 'Belauntza', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20022', 'Berastegi', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20023', 'Berrobi', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20024', 'Bidania-Goiatz', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20025', 'Zegama', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20026', 'Zerain', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20027', 'Zestoa', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20028', 'Zizurkil', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20029', 'Deba', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20031', 'Elduain', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20034', 'Eskoriatza', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20035', 'Ezkio-Itsaso', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20036', 'Hondarribia', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20037', 'Gaintza', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20038', 'Gabiria', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20041', 'Hernialde', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20042', 'Ibarra', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20043', 'Idiazabal', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20044', 'Ikaztegieta', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20045', 'Irun', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20046', 'Irura', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20047', 'Itsasondo', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20048', 'Larraul', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20049', 'Lazkao', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20050', 'Leaburu', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20051', 'Legazpi', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20052', 'Legorreta', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20053', 'Lezo', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20054', 'Lizartza', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20055', 'Arrasate/Mondragón', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20056', 'Mutriku', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20057', 'Mutiloa', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20058', 'Olaberria', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20060', 'Orexa', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20061', 'Orio', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20062', 'Ormaiztegi', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20063', 'Oiartzun', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20066', 'Errezil', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20068', 'Leintz-Gatzaga', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20070', 'Segura', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20071', 'Tolosa', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20075', 'Villabona', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20076', 'Ordizia', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20077', 'Urretxu', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20078', 'Zaldibia', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20079', 'Zarautz', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20080', 'Zumarraga', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20081', 'Zumaia', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20901', 'Mendaro', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20904', 'Baliarrain', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20905', 'Orendain', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20906', 'Altzaga', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('20907', 'Gaztelu', '20', 'Gipuzkoa', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21001', 'Alájar', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21003', 'El Almendro', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21004', 'Almonaster la Real', '21', 'Huelva', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21006', 'Alosno', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21007', 'Aracena', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21008', 'Aroche', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21009', 'Arroyomolinos de León', '21', 'Huelva', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21010', 'Ayamonte', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21012', 'Berrocal', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21015', 'Cabezas Rubias', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21016', 'Cala', '21', 'Huelva', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21017', 'Calañas', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21020', 'Cañaveral de León', '21', 'Huelva', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21023', 'El Cerro de Andévalo', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21025', 'Cortegana', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21026', 'Cortelazor', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21027', 'Cumbres de Enmedio', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21028', 'Cumbres de San Bartolomé', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21029', 'Cumbres Mayores', '21', 'Huelva', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21031', 'Encinasola', '21', 'Huelva', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21036', 'La Granada de Río-Tinto', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21038', 'Higuera de la Sierra', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21039', 'Hinojales', '21', 'Huelva', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21043', 'Jabugo', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21045', 'Linares de la Sierra', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21051', 'La Nava', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21052', 'Nerva', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21056', 'Paterna del Campo', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21058', 'Puebla de Guzmán', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21059', 'Puerto Moral', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21062', 'Rosal de la Frontera', '21', 'Huelva', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21067', 'Santa Ana la Real', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21068', 'Santa Bárbara de Casa', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21071', 'Valdelarco', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21072', 'Valverde del Camino', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21076', 'Villanueva de los Castillejos', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21078', 'Zalamea la Real', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('21079', 'Zufre', '21', 'Huelva', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22006', 'Aisa', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22007', 'Albalate de Cinca', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22009', 'Albelda', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22015', 'Alcalá del Obispo', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22017', 'Alcolea de Cinca', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22021', 'Almudévar', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22023', 'Almuniente', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22029', 'Antillón', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22050', 'Barbuñales', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22052', 'Belver de Cinca', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22054', 'Benasque', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22055', 'Berbegal', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22057', 'Bielsa', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22059', 'Biescas', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22060', 'Binaced', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22062', 'Bisaurri', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22078', 'Canfranc', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22079', 'Capdesaso', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22081', 'Casbas de Huesca', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22082', 'Castejón del Puente', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22084', 'Castejón de Sos', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22095', 'Chía', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22112', 'Fraga', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22114', 'Gistaín', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22116', 'Grañén', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22122', 'Hoz de Jaca', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22125', 'Huesca', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22128', 'Ilche', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22129', 'Isábena', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22130', 'Jaca', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22135', 'Laluenga', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22136', 'Lalueza', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22137', 'Lanaja', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22139', 'Laperdiguera', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22141', 'Lascellas-Ponzano', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22143', 'Laspaúles', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22149', 'Loarre', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22150', 'Loporzano', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22156', 'Monflorite-Lascasas', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22157', 'Montanuy', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22158', 'Monzón', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22167', 'Osso de Cinca', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22170', 'Panticosa', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22174', 'Peralta de Alcofea', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22182', 'Plan', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22184', 'Poleñino', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22188', 'Puente de Montañana', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22193', 'Pueyo de Santa Cruz', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22195', 'Quicena', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22200', 'Sahún', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22203', 'Salillas', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22204', 'Sallent de Gállego', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22207', 'San Juan de Plan', '22', 'Huesca', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22213', 'Sariñena', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22215', 'Seira', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22217', 'Sena', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22221', 'Sesué', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22222', 'Siétamo', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22223', 'Sopeira', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22226', 'Tardienta', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22227', 'Tella-Sin', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22228', 'Tierz', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22232', 'Torralba de Aragón', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22234', 'Torrente de Cinca', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22235', 'Torres de Alcanadre', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22236', 'Torres de Barbués', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22246', 'Beranuy', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22248', 'Vicién', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22249', 'Villanova', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22251', 'Villanueva de Sigena', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22902', 'Puente la Reina de Jaca', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('22903', 'San Miguel del Cinca', '22', 'Huesca', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23004', 'Aldeaquemada', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23005', 'Andújar', '23', 'Jaén', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23011', 'Baños de la Encina', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23017', 'Cabra del Santo Cristo', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23021', 'Carboneros', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23029', 'Chiclana de Segura', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23037', 'Génave', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23039', 'Guarromán', '23', 'Jaén', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23046', 'Ibros', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23055', 'Linares', '23', 'Jaén', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23057', 'Lupión', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23059', 'Marmolejo', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23062', 'Montizón', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23063', 'Navas de San Juan', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23070', 'Pozo Alcón', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23071', 'Puente de Génave', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23072', 'La Puerta de Segura', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23076', 'Santa Elena', '23', 'Jaén', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23085', 'Torreblascopedro', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23091', 'Torres de Albánchez', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23094', 'Vilches', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23096', 'Villanueva de la Reina', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23904', 'Santiago-Pontones', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('23905', 'Arroyo del Ojanco', '23', 'Jaén', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24001', 'Acebedo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24007', 'Arganza', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24008', 'Astorga', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24009', 'Balboa', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24010', 'La Bañeza', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24011', 'Barjas', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24012', 'Los Barrios de Luna', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24014', 'Bembibre', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24016', 'Benuza', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24019', 'Berlanga del Bierzo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24020', 'Boca de Huérgano', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24021', 'Boñar', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24022', 'Borrenes', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24023', 'Brazuelo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24025', 'Burón', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24027', 'Cabañas Raras', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24029', 'Cabrillanes', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24030', 'Cacabelos', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24034', 'Camponaraya', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24036', 'Valle de Ancares', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24037', 'Cármenes', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24038', 'Carracedelo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24040', 'Carrocera', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24041', 'Carucedo', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24043', 'Castrillo de Cabrera', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24044', 'Castrillo de la Valduerna', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24046', 'Castrocalbón', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24047', 'Castrocontrigo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24049', 'Castropodame', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24057', 'Congosto', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24059', 'Corullón', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24060', 'Crémenes', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24061', 'Cuadros', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24064', 'Cubillos del Sil', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24066', 'Destriana', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24067', 'Encinedo', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24069', 'Escobar de Campos', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24070', 'Fabero', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24071', 'Folgoso de la Ribera', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24077', 'Gordaliza del Pino', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24079', 'Gradefes', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24080', 'Grajal de Campos', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24083', 'Igüeña', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24086', 'Joarilla de las Matas', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24090', 'Lucillo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24091', 'Luyego', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24093', 'Magaz de Cepeda', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24096', 'Maraña', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24098', 'Matallana de Torío', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24100', 'Molinaseca', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24101', 'Murias de Paredes', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24102', 'Noceda del Bierzo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24103', 'Oencia', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24104', 'Las Omañas', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24106', 'Oseja de Sajambre', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24108', 'Palacios de la Valduerna', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24109', 'Palacios del Sil', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24110', 'Páramo del Sil', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24112', 'Peranzanes', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24114', 'La Pola de Gordón', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24115', 'Ponferrada', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24116', 'Posada de Valdeón', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24118', 'Prado de la Guzpeña', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24119', 'Priaranza del Bierzo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24120', 'Prioro', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24121', 'Puebla de Lillo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24122', 'Puente de Domingo Flórez', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24123', 'Quintana del Castillo', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24124', 'Quintana del Marco', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24125', 'Quintana y Congosto', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24129', 'Reyero', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24130', 'Riaño', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24131', 'Riego de la Vega', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24132', 'Riello', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24133', 'Rioseco de Tapia', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24134', 'La Robla', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24137', 'Sabero', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24139', 'Sahagún', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24143', 'Sancedo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24144', 'San Cristóbal de la Polantera', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24145', 'San Emiliano', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24146', 'San Esteban de Nogales', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24148', 'San Justo de la Vega', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24152', 'Santa Colomba de Somoza', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24154', 'Santa Elena de Jamuz', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24155', 'Santa María de la Isla', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24156', 'Santa María del Monte de Cea', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24158', 'Santa María de Ordás', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24161', 'Santiago Millas', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24164', 'Sena de Luna', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24165', 'Sobrado', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24167', 'Soto y Amío', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24169', 'Toreno', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24170', 'Torre del Bierzo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24171', 'Trabadelo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24172', 'Truchas', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24177', 'Valdelugueros', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24179', 'Valdepiélago', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24180', 'Valdepolo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24182', 'Valderrey', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24183', 'Valderrueda', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24184', 'Valdesamario', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24185', 'Val de San Lorenzo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24191', 'Vallecillo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24194', 'Vegacervera', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24196', 'Vega de Espinareda', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24198', 'Vega de Valcarce', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24199', 'Vegaquemada', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24202', 'Villablino', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24206', 'Toral de los Vados', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24209', 'Villafranca del Bierzo', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24210', 'Villagatón', '24', 'León', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24214', 'Villamejil', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24216', 'Villamontán de la Valduerna', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24219', 'Villaobispo de Otero', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('24901', 'Villamanín', '24', 'León', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25003', 'Agramunt', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25005', 'Alàs i Cerc', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25007', 'Albatàrrec', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25008', 'Albesa', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25010', 'Alcanó', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25011', 'Alcarràs', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25012', 'Alcoletge', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25016', 'Alguaire', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25017', 'Alins', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25019', 'Almacelles', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25023', 'Alpicat', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25024', 'Alt Àneu', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25025', 'Naut Aran', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25027', 'Anglesola', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25030', 'El Pont de Bar', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25031', 'Arres', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25032', 'Arsèguel', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25035', 'La Sentiu de Sió', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25038', 'Aitona', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25039', 'Baix Pallars', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25040', 'Balaguer', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25041', 'Barbens', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25043', 'La Vall de Boí', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25045', 'Bausen', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25047', 'Bellcaire d''Urgell', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25048', 'Bell-lloc d''Urgell', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25050', 'Bellpuig', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25051', 'Bellver de Cerdanya', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25055', 'Biosca', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25057', 'Es Bòrdes', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25059', 'Bossòst', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25061', 'Cabó', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25063', 'Canejan', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25068', 'Castellnou de Seana', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25070', 'Castellserà', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25071', 'Cava', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25072', 'Cervera', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25078', 'Corbins', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25082', 'Espot', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25085', 'Estaràs', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25086', 'Esterri d''Àneu', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25087', 'Esterri de Cardós', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25088', 'Estamariu', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25089', 'Farrera', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25096', 'La Fuliola', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25113', 'Ivars d''Urgell', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25120', 'Lleida', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25121', 'Les', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25123', 'Lladorre', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25126', 'Llavorsí', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25127', 'Lles de Cerdanya', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25131', 'Massalcoreig', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25134', 'Menàrguens', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25138', 'Montgai', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25139', 'Montellà i Martinet', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25140', 'Montferrer i Castellbò', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25141', 'Montoliu de Segarra', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25142', 'Montoliu de Lleida', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25143', 'Montornès de Segarra', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25152', 'Les Oluges', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25155', 'Organyà', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25157', 'Ossó de Sió', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25164', 'Penelles', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25168', 'El Poal', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25172', 'Ponts', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25173', 'El Pont de Suert', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25174', 'La Portella', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25175', 'Prats i Sansor', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25177', 'Preixens', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25179', 'Prullans', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25181', 'Puigverd d''Agramunt', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25182', 'Puigverd de Lleida', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25183', 'Rialp', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25185', 'Ribera d''Urgellet', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25191', 'Sanaüja', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25201', 'Sarroca de Bellera', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25202', 'Senterada', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25203', 'La Seu d''Urgell', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25208', 'Soriguera', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25209', 'Sort', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25210', 'Soses', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25211', 'Sudanell', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25216', 'Talavera', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25217', 'Tàrrega', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25219', 'Tarroja de Segarra', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25220', 'Térmens', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25221', 'Tírvia', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25223', 'Torà', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25225', 'Tornabous', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25227', 'La Torre de Cabdella', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25231', 'Torrelameu', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25232', 'Torres de Segre', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25239', 'Les Valls de Valira', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25240', 'Vallfogona de Balaguer', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25243', 'Vielha e Mijaran', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25244', 'Vilagrassa', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25245', 'Vilaller', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25247', 'Vilamòs', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25249', 'Vilanova de l''Aguda', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25251', 'Vilanova de Segrià', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25252', 'Vila-sana', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25254', 'Vilanova de la Barca', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25901', 'Vall de Cardós', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25903', 'La Guingueta d''Àneu', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25905', 'Ribera d''Ondara', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25906', 'Les Valls d''Aguilar', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25907', 'Torrefeta i Florejacs', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25908', 'Fígols i Alinyà', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25909', 'La Vansa i Fórnols', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25910', 'Josa i Tuixén', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25911', 'Els Plans de Sió', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25912', 'Gimenells i el Pla de la Font', '25', 'Lleida', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('25913', 'Riu de Cerdanya', '25', 'Lleida', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26002', 'Agoncillo', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26004', 'Ajamil de Cameros', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26008', 'Aldeanueva de Ebro', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26011', 'Alfaro', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26013', 'Anguciana', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26014', 'Anguiano', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26017', 'Arnedillo', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26018', 'Arnedo', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26019', 'Arrúbal', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26021', 'Autol', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26023', 'Badarán', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26024', 'Bañares', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26025', 'Baños de Rioja', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26026', 'Baños de Río Tobía', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26027', 'Berceo', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26028', 'Bergasa', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26031', 'Bobadilla', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26032', 'Brieva de Cameros', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26036', 'Calahorra', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26038', 'Canales de la Sierra', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26040', 'Cañas', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26041', 'Cárdenas', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26042', 'Casalarreina', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26043', 'Castañares de Rioja', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26047', 'Cervera del Río Alhama', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26048', 'Cidamón', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26050', 'Cirueña', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26054', 'Cornago', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26058', 'Enciso', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26060', 'Estollo', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26061', 'Ezcaray', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26070', 'Grávalos', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26071', 'Haro', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26072', 'Herce', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26074', 'Hervías', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26077', 'Hornillos de Cameros', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26080', 'Igea', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26083', 'Lagunilla del Jubera', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26088', 'Leza de Río Leza', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26093', 'Mansilla de la Sierra', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26094', 'Manzanares de Rioja', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26095', 'Matute', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26098', 'Munilla', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26099', 'Murillo de Río Leza', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26108', 'Ocón', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26112', 'Ortigosa de Cameros', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26113', 'Pazuengos', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26120', 'Quel', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26122', 'El Rasillo de Cameros', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26125', 'Rincón de Soto', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26126', 'Robres del Castillo', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26127', 'Rodezno', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26130', 'San Millán de la Cogolla', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26132', 'San Román de Cameros', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26135', 'Santa Engracia del Jubera', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26136', 'Santa Eulalia Bajera', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26138', 'Santo Domingo de la Calzada', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26139', 'San Torcuato', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26141', 'Santurdejo', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26152', 'Torrecilla sobre Alesanco', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26162', 'Valgañón', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26164', 'Ventrosa', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26167', 'Villalobar de Rioja', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26171', 'Villar de Torre', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26175', 'Villavelayo', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26178', 'Viniegra de Abajo', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26179', 'Viniegra de Arriba', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26180', 'Zarratón', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26181', 'Zarzosa', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('26183', 'Zorraquín', '26', 'La Rioja', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27001', 'Abadín', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27002', 'Alfoz', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27003', 'Antas de Ulla', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27004', 'Baleira', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27005', 'Barreiros', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27006', 'Becerreá', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27007', 'Begonte', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27008', 'Bóveda', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27009', 'Carballedo', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27010', 'Castro de Rei', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27011', 'Castroverde', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27012', 'Cervantes', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27013', 'Cervo', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27014', 'O Corgo', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27015', 'Cospeito', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27016', 'Chantada', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27017', 'Folgoso do Courel', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27018', 'A Fonsagrada', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27019', 'Foz', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27020', 'Friol', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27021', 'Xermade', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27022', 'Guitiriz', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27023', 'Guntín', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27024', 'O Incio', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27025', 'Xove', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27026', 'Láncara', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27027', 'Lourenzá', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27028', 'Lugo', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27029', 'Meira', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27030', 'Mondoñedo', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27031', 'Monforte de Lemos', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27032', 'Monterroso', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27033', 'Muras', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27034', 'Navia de Suarna', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27035', 'Negueira de Muñiz', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27037', 'As Nogais', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27038', 'Ourol', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27039', 'Outeiro de Rei', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27040', 'Palas de Rei', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27041', 'Pantón', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27042', 'Paradela', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27043', 'O Páramo', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27044', 'A Pastoriza', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27045', 'Pedrafita do Cebreiro', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27046', 'Pol', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27047', 'A Pobra do Brollón', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27048', 'A Pontenova', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27049', 'Portomarín', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27050', 'Quiroga', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27051', 'Ribadeo', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27052', 'Ribas de Sil', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27053', 'Ribeira de Piquín', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27054', 'Riotorto', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27055', 'Samos', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27056', 'Rábade', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27057', 'Sarria', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27058', 'O Saviñao', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27059', 'Sober', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27060', 'Taboada', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27061', 'Trabada', '27', 'Lugo', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27062', 'Triacastela', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27063', 'O Valadouro', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27064', 'O Vicedo', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27065', 'Vilalba', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27066', 'Viveiro', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27901', 'Baralla', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('27902', 'Burela', '27', 'Lugo', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28001', 'La Acebeda', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28002', 'Ajalvir', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28003', 'Alameda del Valle', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28004', 'El Álamo', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28005', 'Alcalá de Henares', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28006', 'Alcobendas', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28007', 'Alcorcón', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28008', 'Aldea del Fresno', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28009', 'Algete', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28010', 'Alpedrete', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28013', 'Aranjuez', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28014', 'Arganda del Rey', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28016', 'El Atazar', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28017', 'Batres', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28018', 'Becerril de la Sierra', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28020', 'Berzosa del Lozoya', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28021', 'El Berrueco', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28023', 'El Boalo', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28024', 'Braojos', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28026', 'Brunete', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28027', 'Buitrago del Lozoya', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28028', 'Bustarviejo', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28029', 'Cabanillas de la Sierra', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28030', 'La Cabrera', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28031', 'Cadalso de los Vidrios', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28032', 'Camarma de Esteruelas', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28034', 'Canencia', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28036', 'Casarrubuelos', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28037', 'Cenicientos', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28038', 'Cercedilla', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28039', 'Cervera de Buitrago', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28041', 'Cobeña', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28042', 'Colmenar del Arroyo', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28043', 'Colmenar de Oreja', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28044', 'Colmenarejo', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28045', 'Colmenar Viejo', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28046', 'Collado Mediano', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28047', 'Collado Villalba', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28049', 'Coslada', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28050', 'Cubas de la Sagra', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28051', 'Chapinería', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28053', 'Daganzo de Arriba', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28054', 'El Escorial', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28056', 'Fresnedillas de la Oliva', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28057', 'Fresno de Torote', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28058', 'Fuenlabrada', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28059', 'Fuente el Saz de Jarama', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28060', 'Fuentidueña de Tajo', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28061', 'Galapagar', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28062', 'Garganta de los Montes', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28063', 'Gargantilla del Lozoya y Pinilla de Buitrago', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28064', 'Gascones', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28065', 'Getafe', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28066', 'Griñón', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28067', 'Guadalix de la Sierra', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28068', 'Guadarrama', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28069', 'La Hiruela', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28070', 'Horcajo de la Sierra-Aoslos', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28071', 'Horcajuelo de la Sierra', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28072', 'Hoyo de Manzanares', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28074', 'Leganés', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28075', 'Loeches', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28076', 'Lozoya', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28078', 'Madarcos', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28082', 'Manzanares el Real', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28083', 'Meco', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28084', 'Mejorada del Campo', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28085', 'Miraflores de la Sierra', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28086', 'El Molar', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28087', 'Los Molinos', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28088', 'Montejo de la Sierra', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28090', 'Moralzarzal', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28091', 'Morata de Tajuña', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28093', 'Navacerrada', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28094', 'Navalafuente', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28095', 'Navalagamella', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28096', 'Navalcarnero', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28097', 'Navarredonda y San Mamés', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28099', 'Navas del Rey', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28104', 'Paracuellos de Jarama', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28107', 'Patones', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28108', 'Pedrezuela', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28109', 'Pelayos de la Presa', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28110', 'Perales de Tajuña', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28112', 'Pinilla del Valle', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28113', 'Pinto', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28114', 'Piñuécar-Gandullas', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28117', 'Prádena del Rincón', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28118', 'Puebla de la Sierra', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28119', 'Quijorna', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28120', 'Rascafría', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28121', 'Redueña', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28124', 'Robledillo de la Jara', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28125', 'Robledo de Chavela', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28126', 'Robregordo', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28127', 'Las Rozas de Madrid', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28128', 'Rozas de Puerto Real', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28129', 'San Agustín del Guadalix', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28130', 'San Fernando de Henares', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28131', 'San Lorenzo de El Escorial', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28132', 'San Martín de la Vega', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28133', 'San Martín de Valdeiglesias', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28134', 'San Sebastián de los Reyes', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28135', 'Santa María de la Alameda', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28137', 'Los Santos de la Humosa', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28138', 'La Serna del Monte', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28141', 'Sevilla la Nueva', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28143', 'Somosierra', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28144', 'Soto del Real', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28145', 'Talamanca de Jarama', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28146', 'Tielmes', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28147', 'Titulcia', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28148', 'Torrejón de Ardoz', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28150', 'Torrejón de Velasco', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28151', 'Torrelaguna', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28152', 'Torrelodones', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28153', 'Torremocha de Jarama', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28154', 'Torres de la Alameda', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28156', 'Valdeavero', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28158', 'Valdemanco', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28159', 'Valdemaqueda', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28160', 'Valdemorillo', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28162', 'Valdeolmos-Alalpardo', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28163', 'Valdepiélagos', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28164', 'Valdetorres de Jarama', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28166', 'Valverde de Alcalá', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28167', 'Velilla de San Antonio', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28168', 'El Vellón', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28169', 'Venturada', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28170', 'Villaconejos', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28171', 'Villa del Prado', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28172', 'Villalbilla', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28173', 'Villamanrique de Tajo', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28174', 'Villamanta', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28175', 'Villamantilla', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28176', 'Villanueva de la Cañada', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28177', 'Villanueva del Pardillo', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28178', 'Villanueva de Perales', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28181', 'Villaviciosa de Odón', '28', 'Madrid', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28182', 'Villavieja del Lozoya', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28183', 'Zarzalejo', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28901', 'Lozoyuela-Navas-Sieteiglesias', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28902', 'Puentes Viejas', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('28903', 'Tres Cantos', '28', 'Madrid', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29005', 'Algarrobo', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29009', 'Almáchar', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29026', 'Benamargosa', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29027', 'Benamocarra', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29029', 'Benarrabá', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29030', 'El Borge', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29042', 'Coín', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29043', 'Colmenar', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29044', 'Comares', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29057', 'Genalguacil', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29058', 'Guaro', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29061', 'Istán', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29064', 'Jubrique', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29066', 'Macharaviaya', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29067', 'Málaga', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29073', 'Monda', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29076', 'Ojén', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29086', 'Sayalonga', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29090', 'Tolox', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29091', 'Torrox', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('29094', 'Vélez-Málaga', '29', 'Málaga', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('30003', 'Águilas', '30', 'Murcia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('30016', 'Cartagena', '30', 'Murcia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('30033', 'Puerto Lumbreras', '30', 'Murcia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31005', 'Aberin', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31009', 'Aibar/Oibar', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31011', 'Allín/Allin', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31012', 'Allo', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31020', 'Araitz', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31022', 'Arantza', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31024', 'Arano', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31025', 'Arakil', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31029', 'Los Arcos', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31031', 'Areso', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31040', 'Atez / Atetz', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31041', 'Ayegui/Aiegi', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31049', 'Basaburua', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31050', 'Baztan', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31053', 'Berbinzana', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31054', 'Bertizarana', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31058', 'Auritz/Burguete', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31061', 'El Busto', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31064', 'Cadreita', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31070', 'Castejón', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31072', 'Cintruénigo', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31073', 'Ziordia', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31077', 'Corella', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31079', 'Desojo', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31081', 'Donamaria', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31082', 'Etxalar', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31087', 'Elgorriaga', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31090', 'Eratsun', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31092', 'Erro', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31097', 'Estella-Lizarra', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31102', 'Ezkurra', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31103', 'Ezprogui', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31104', 'Falces', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31105', 'Fitero', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31117', 'Goizueta', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31125', 'Igúzquiza', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31126', 'Imotz', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31129', 'Ituren', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31131', 'Iza/Itza', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31136', 'Juslapeña/Txulapain', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31137', 'Beintza-Labaien', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31144', 'Larraun', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31145', 'Lazagurría', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31149', 'Leitza', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31153', 'Lesaka', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31155', 'Liédena', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31159', 'Lumbier', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31165', 'Mendavia', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31167', 'Mendigorria', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31169', 'Milagro', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31170', 'Mirafuentes', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31171', 'Miranda de Arga', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31175', 'Mues', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31182', 'Nazar', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31186', 'Odieta', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31187', 'Oiz', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31211', 'Orreaga/Roncesvalles', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31213', 'Saldías', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31216', 'Sangüesa/Zangoza', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31221', 'Doneztebe/Santesteban', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31224', 'Sesma', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31226', 'Sunbilla', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31231', 'Torres del Río', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31236', 'Ultzama', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31239', 'Urdazubi/Urdax', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31244', 'Urroz', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31248', 'Luzaide/Valcarlos', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31249', 'Valtierra', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31250', 'Bera', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31251', 'Viana', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31254', 'Villafranca', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31257', 'Villatuerta', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31259', 'Igantzi', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31260', 'Valle de Yerri/Deierri', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31263', 'Zubieta', '31', 'Navarra', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31264', 'Zugarramurdi', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('31904', 'Irurtzun', '31', 'Navarra', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32001', 'Allariz', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32002', 'Amoeiro', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32003', 'A Arnoia', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32004', 'Avión', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32005', 'Baltar', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32006', 'Bande', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32007', 'Baños de Molgas', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32008', 'Barbadás', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32009', 'O Barco de Valdeorras', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32010', 'Beade', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32011', 'Beariz', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32012', 'Os Blancos', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32013', 'Boborás', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32014', 'A Bola', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32015', 'O Bolo', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32016', 'Calvos de Randín', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32017', 'Carballeda de Valdeorras', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32018', 'Carballeda de Avia', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32019', 'O Carballiño', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32020', 'Cartelle', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32021', 'Castrelo do Val', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32022', 'Castrelo de Miño', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32023', 'Castro Caldelas', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32024', 'Celanova', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32025', 'Cenlle', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32026', 'Coles', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32027', 'Cortegada', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32028', 'Cualedro', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32029', 'Chandrexa de Queixa', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32030', 'Entrimo', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32031', 'Esgos', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32032', 'Xinzo de Limia', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32033', 'Gomesende', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32034', 'A Gudiña', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32035', 'O Irixo', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32036', 'Xunqueira de Ambía', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32037', 'Xunqueira de Espadanedo', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32038', 'Larouco', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32039', 'Laza', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32040', 'Leiro', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32041', 'Lobeira', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32042', 'Lobios', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32043', 'Maceda', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32044', 'Manzaneda', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32045', 'Maside', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32046', 'Melón', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32047', 'A Merca', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32048', 'A Mezquita', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32049', 'Montederramo', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32050', 'Monterrei', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32051', 'Muíños', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32052', 'Nogueira de Ramuín', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32053', 'Oímbra', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32054', 'Ourense', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32055', 'Paderne de Allariz', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32056', 'Padrenda', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32057', 'Parada de Sil', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32058', 'O Pereiro de Aguiar', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32059', 'A Peroxa', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32060', 'Petín', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32061', 'Piñor', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32062', 'Porqueira', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32063', 'A Pobra de Trives', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32064', 'Pontedeva', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32065', 'Punxín', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32066', 'Quintela de Leirado', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32067', 'Rairiz de Veiga', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32068', 'Ramirás', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32069', 'Ribadavia', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32070', 'San Xoán de Río', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32071', 'Riós', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32072', 'A Rúa', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32073', 'Rubiá', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32074', 'San Amaro', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32075', 'San Cibrao das Viñas', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32076', 'San Cristovo de Cea', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32077', 'Sandiás', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32078', 'Sarreaus', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32079', 'Taboadela', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32080', 'A Teixeira', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32081', 'Toén', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32082', 'Trasmiras', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32083', 'A Veiga', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32084', 'Verea', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32085', 'Verín', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32086', 'Viana do Bolo', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32087', 'Vilamarín', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32088', 'Vilamartín de Valdeorras', '32', 'Ourense', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32089', 'Vilar de Barrio', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32090', 'Vilar de Santos', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32091', 'Vilardevós', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('32092', 'Vilariño de Conso', '32', 'Ourense', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33001', 'Allande', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33002', 'Aller', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33003', 'Amieva', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33005', 'Belmonte de Miranda', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33007', 'Boal', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33010', 'Candamo', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33011', 'Cangas del Narcea', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33016', 'Castrillón', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33017', 'Castropol', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33018', 'Coaña', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33021', 'Cudillero', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33022', 'Degaña', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33023', 'El Franco', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33024', 'Gijón', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33026', 'Grado', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33027', 'Grandas de Salime', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33028', 'Ibias', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33029', 'Illano', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33030', 'Illas', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33032', 'Laviana', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33033', 'Lena', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33034', 'Valdés', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33035', 'Llanera', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33037', 'Mieres', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33039', 'Muros de Nalón', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33041', 'Navia', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33044', 'Oviedo', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33048', 'Pesoz', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33050', 'Ponga', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33051', 'Pravia', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33054', 'Las Regueras', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33057', 'Ribera de Arriba', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33059', 'Salas', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33060', 'San Martín del Rey Aurelio', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33061', 'San Martín de Oscos', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33062', 'Santa Eulalia de Oscos', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33063', 'San Tirso de Abres', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33064', 'Santo Adriano', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33066', 'Siero', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33068', 'Somiedo', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33069', 'Soto del Barco', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33070', 'Tapia de Casariego', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33071', 'Taramundi', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33072', 'Teverga', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33073', 'Tineo', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33074', 'Vegadeo', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33075', 'Villanueva de Oscos', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33077', 'Villayón', '33', 'Asturias', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('33078', 'Yernes y Tameza', '33', 'Asturias', 'Zona II');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34001', 'Abarca de Campos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34019', 'Autillo de Campos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34027', 'Barruelo de Santullán', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34029', 'Becerril de Campos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34035', 'Boadilla de Rioseco', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34038', 'Bustillo de la Vega', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34039', 'Bustillo del Páramo de Carrión', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34042', 'Calzada de los Molinos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34045', 'Capillas', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34046', 'Cardeñosa de Volpejera', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34047', 'Carrión de los Condes', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34053', 'Castromocho', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34055', 'Cervatos de la Cueza', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34056', 'Cervera de Pisuerga', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34059', 'Cisneros', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34067', 'Dehesa de Montejo', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34072', 'Frechilla', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34076', 'Fuentes de Nava', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34081', 'Guaza de Campos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34091', 'Lagartos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34094', 'Ledigos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34096', 'Lomas', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34102', 'Mazariegos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34103', 'Mazuecos de Valdeginate', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34109', 'Moratinos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34112', 'Nogal de las Huertas', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34123', 'Paredes de Nava', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34126', 'Pedrosa de la Vega', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34131', 'Población de Arroyo', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34132', 'Población de Campos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34137', 'Pozo de Urama', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34143', 'Quintanilla de Onsoña', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34147', 'Renedo de la Vega', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34152', 'Revenga de Campos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34156', 'Riberos de la Cueza', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34158', 'Salinas de Pisuerga', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34163', 'San Mamés de Campos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34165', 'San Román de la Cuba', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34175', 'La Serna', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34185', 'Triollo', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34199', 'Velilla del Río Carrión', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34204', 'Villacidaler', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34206', 'Villada', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34215', 'Villalcázar de Sirga', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34216', 'Villalcón', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34220', 'Villamartín de Campos', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34223', 'Villamoronta', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34224', 'Villamuera de la Cueza', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34227', 'Villanueva del Rebollar', '34', 'Palencia', 'Zona I');

INSERT OR REPLACE INTO cte_radon_municipalities (municipality_code, municipality_name, province_code, province_name, zone) VALUES ('34230', 'Villarmentero de Campos', '34', 'Palencia', 'Zona I');
