const extendedChoices = {
  STATUS:
    [
      { key: 'OPEN', value: 'OPEN', primaryText: "Open" },
      { key: 'PENDING', value: 'PENDING', primaryText: "Pending" },
      { key: 'INVALID', value: 'INVALID', primaryText: "Invalid" },
      { key: 'SOLVED', value: 'SOLVED', primaryText: "Solved" },
    ]
  ,
  PRIORITY:
    [
      { key: 'HIGH', value: 'HIGH', primaryText: "High" },
      { key: 'MEDIUM', value: 'MEDIUM', primaryText: "Medium" },
      { key: 'LOW', value: 'LOW', primaryText: "Low" },
    ]
};

export default extendedChoices;