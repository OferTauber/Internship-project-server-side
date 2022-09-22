class FirstOrderPortDTO {
  geometry: { type: string; coordinates: [number, number] };
  id: string;
  geometry_name: string;
  type: string;
  properties: {
    portname: string;
    country: string;
    iso3_op: string;
    code: string;
    iso3: string;
  };
}

export default FirstOrderPortDTO;
