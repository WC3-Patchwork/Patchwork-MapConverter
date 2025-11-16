enum AssetType {
  Standard = 'standard',
  Custom = 'custom'
}

interface Asset {
  path: string
  type: AssetType
}

export { type Asset, AssetType }
