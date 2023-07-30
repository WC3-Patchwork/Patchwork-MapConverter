enum ParameterType {
  INVALID = -1,
  PRESET = 0,
  VARIABLE = 1,
  FUNCTION = 2,
  LITERAL = 3
}

interface Parameter {
  type: ParameterType
}

export { type Parameter, ParameterType }
