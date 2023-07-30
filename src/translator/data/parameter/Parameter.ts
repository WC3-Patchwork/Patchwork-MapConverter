enum ParameterType {
  NOTHING = 0,
  PRESET = 1,
  VARIABLE = 1,
  FUNCTION = 2,
  LITERAL = 3
}

interface Parameter {
  type: ParameterType
}

export { type Parameter, ParameterType }
