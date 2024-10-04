function BinarySearchTree(array) {
  // Create node class for the BST
  const Node = class {
    constructor(data = null, left = null, right = null) {
      this.data = data;
      this.left = left;
      this.right = right;
    }
  };

  //Initial build function for the tree. Takes a sorted array and used midpoint to recursivley populate the tree.
  const buildTree = (array) => {
    if (array.length === 0) {
      return null;
    }

    const mid = Math.floor(array.length / 2);

    const root = new Node(array[mid]);

    root.left = buildTree(array.slice(0, mid));
    root.right = buildTree(array.slice(mid + 1));

    return root;
  };

  let root = buildTree(array);

  //Traverses the tree by comapring value to be added with the node.value and then determining to travel left or right.
  const insert = (value, node = root) => {
    if (value == node.data) {
      return null;
    } else if (value > node.data) {
      if (node.right == null) {
        node.right = new Node(value);
      } else {
        insert(value, node.right);
      }
    } else if (value < node.data) {
      if (node.left == null) {
        node.left = new Node(value);
      } else {
        insert(value, node.left);
      }
    }
  };

  //Also traverses the tree by comparing value to be added with node.value, then finding the desired value
  //it then checks for several cases (no children, one child, two child) and replaces the node if needed.
  const deleteItem = (value, node = root) => {
    if (node == null) {
      console.log("Doesn't exist in tree");
      return null;
    }

    if (node.data > value) {
      node.left = deleteItem(value, node.left);
    } else if (node.data < value) {
      node.right = deleteItem(value, node.right);
    } else {
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      node.data = minValue(node.right);

      node.right = deleteItem(node.data, node.right);
    }
    return node;
  };

  //Helper function that finds smallest value in subtree. The value it finds will be the replacement for the deleted node.
  const minValue = (node) => {
    let current = node;
    while (current.left != null) {
      current = current.left;
    }
    return current.data;
  };

  const find = (value, node = root) => {
    if (node === null) {
      console.log("Value not in tree");
      return null;
    } else if (node.data == value) {
      console.log(node);
      return node;
    } else if (node.data > value) {
      node.left = find(value, node.left);
    } else if (node.data < value) {
      node.right = find(value, node.right);
    }
  };

  const levelOrder = (node = root) => {
    if (node == null) {
      return;
    }

    const queue = [node];
    const result = [];

    while (queue.length > 0) {
      const level = [];
      const levelSize = queue.length;

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift();
        level.push(node.data);

        if (node.left != null) {
          queue.push(node.left);
        }
        if (node.right != null) {
          queue.push(node.right);
        }
      }
      result.push(level);
    }
    console.table(result);
    return result;
  };

  const inOrder = (node = root) => {
    if (node == null) {
      return;
    }
    inOrder(node.left);
    console.log(node.data);
    inOrder(node.right);
  };

  const preOrder = (node = root) => {
    if (node == null) {
      return;
    }
    console.log(node.data);
    preOrder(node.left);
    preOrder(node.right);
  };

  const postOrder = (node = root) => {
    if (node == null) {
      return;
    }
    postOrder(node.right);
    console.log(node.data);
    postOrder(node.left);
  };

  const height = (node) => {
    if (node == null) {
      return 0;
    }
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);

    return Math.max(leftHeight, rightHeight) + 1;
  };

  const depth = (node, value) => {
    if (node == null) {
      return -1;
    }

    if (node.data === value) {
      return 0;
    }

    const leftDepth = depth(node.left, value);
    const rightDepth = depth(node.right, value);

    if (leftDepth !== -1) {
      return leftDepth + 1;
    }

    if (rightDepth !== -1) {
      return rightDepth + 1;
    }

    return -1;
  };

  const isBalanced = (node = root) => {
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);

    const difference = leftHeight - rightHeight;

    if (difference == 1 || difference == -1 || difference == 0) {
      console.log("Tree is balanced.");
    } else {
      console.log("Tree is not balanced.");
    }
  };

  const rebalance = () => {
    const levelOrderedTable = levelOrder(root);
    let allNodeArray = [];
    for (let array of levelOrderedTable) {
      allNodeArray = allNodeArray.concat(array);
    }
    let sortedArray = allNodeArray.sort(function (a, b) {
      return a - b;
    });
    root = buildTree(sortedArray);
  };

  const prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  return {
    insert,
    deleteItem,
    find,
    levelOrder,
    inOrder,
    preOrder,
    postOrder,
    height,
    depth,
    isBalanced,
    rebalance,
    prettyPrint,
  };
}

function driverScript(BST) {
  const randArray = () => {
    const set = new Set();
    const length = Math.floor(Math.random() * 100) + 1;
    while (set.size < length) {
      set.add(Math.floor(Math.random() * 100));
    }
    return Array.from(set);
  };

  const array = randArray().sort((a, b) => a - b);
  console.log(array);

  const tree = BST(array);

  tree.isBalanced();

  tree.levelOrder();
  tree.inOrder();
  tree.preOrder();
  tree.postOrder();

  tree.insert(150);
  tree.insert(120);
  tree.insert(130);
  tree.insert(140);

  tree.isBalanced();

  tree.rebalance();

  tree.isBalanced();

  tree.levelOrder();
  tree.inOrder();
  tree.preOrder();
  tree.postOrder();
}

driverScript(BinarySearchTree);
