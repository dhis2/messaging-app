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
      { key: 'LOW', value: 'LOW', primaryText: "Low" },
      { key: 'MEDIUM', value: 'MEDIUM', primaryText: "Medium" },
      { key: 'HIGH', value: 'HIGH', primaryText: "High" },
    ]
};

export default extendedChoices;