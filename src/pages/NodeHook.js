const NodeHook = () => {
  const onChangeFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      /* Update state */
      data.shift();
      const transformDataNode = data.reduce((array, next, index) => {
        return [
          ...array,
          {
            id: index + 1,
            latitude: next[0], //x
            longtitude: next[1], //y
            attitude: next[2], //z
            predictAttitude: next[3], //p
          },
        ];
      }, []);
      const centerNode = findCenter(transformDataNode);
      const zone = separateZone(transformDataNode, centerNode);
      this.setState({
        nodes: transformDataNode,
        zone,
      });
    };
    reader.readAsBinaryString(file);
  };
  return (

	)
}