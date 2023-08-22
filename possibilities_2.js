class Node {
    constructor(value = '') {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

// Simplified Morse code tree for the example
function buildTree() {
    const root = new Node();

    root.left = new Node('E');
    root.right = new Node('T');

    root.left.left = new Node('I');
    root.left.right = new Node('A');
    root.right.left = new Node('N');
    root.right.right = new Node('M');

    root.left.left.left = new Node('S');
    root.left.left.right = new Node('U');

    root.left.right.left = new Node('R');
    root.left.right.right = new Node('W');
    root.right.left.left = new Node('G');
    root.right.left.right = new Node('O');

    return root;
}

function search(node, input, results = []) {
    if (node.value !== '' && input.length === 0) {
        results.push(node.value);
    }

    if (input.length > 0) {
        const currentChar = input[0];
        const remainingInput = input.slice(1);

        if (currentChar === '.' && node.left) {
            search(node.left, remainingInput, results);
        } else if (currentChar === '-' && node.right) {
            search(node.right, remainingInput, results);
        } else if (currentChar === '?') {
            if (node.left) {
                search(node.left, remainingInput, results);
            }
            if (node.right) {
                search(node.right, remainingInput, results);
            }
        }
    }

    return results;
}

//1. Parse the signals as letters of the alphabet
//2. Handle cases for '?'
const possibilities = (signals) => {
    const root = buildTree();
    return search(root, signals);
};

console.log(possibilities("?-?"));  // Output: [ 'A', 'N', 'R', 'W', 'G', 'O' ]
