function * TreeIterator<NODE>(root: NODE, getChildNodes: (parent: NODE) => NODE[] | undefined): Generator<[NODE[], NODE]> {
  const traversalStack = [root]
  const parentMaps = new Map<NODE, NODE[]>()

  while (traversalStack.length > 0) {
    const node = traversalStack.pop()
    if (node == null) continue

    const children = getChildNodes(node)
    let childParentPath = parentMaps.get(node)
    if (childParentPath == null) {
      childParentPath = []
    } else { // copy
      childParentPath = childParentPath.map(it => it)
    }

    childParentPath.push(node)
    if (children != null) {
      for (const child of children) {
        parentMaps.set(child, childParentPath)
        traversalStack.push(child)
      }
    }

    childParentPath = childParentPath.map(it => it)
    childParentPath.pop()

    yield [childParentPath, node]
  }
}

export default TreeIterator