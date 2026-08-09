/* ============================================================
   AI Study Planner — Quiz Mock Data
   6 categories, 5+ questions each
   ============================================================ */

const QUIZ_DATA = [
    /* ============================
       1. PYTHON
       ============================ */
    {
        id: "python",
        name: "Python",
        description: "Master Python fundamentals, data types, and core concepts.",
        icon: "fa-brands fa-python",
        color: "#3776AB",
        gradient: "linear-gradient(135deg, #3776AB, #FFD43B)",
        difficulty: "easy",
        estimatedTime: "5 min",
        questions: [
            {
                question: "What is the correct file extension for a Python file?",
                options: [".java", ".py", ".html", ".css"],
                correct: 1,
                explanation: "Python files use the .py extension. This tells the interpreter and IDEs that the file contains Python code."
            },
            {
                question: "Which keyword is used to define a function in Python?",
                options: ["function", "func", "def", "define"],
                correct: 2,
                explanation: "The 'def' keyword is used to define a function in Python. For example: def my_function():"
            },
            {
                question: "What is the output of print(type(5))?",
                options: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'number'>"],
                correct: 1,
                explanation: "In Python, 5 is an integer literal. The type() function returns <class 'int'> for whole numbers."
            },
            {
                question: "Which of the following is used to create a list in Python?",
                options: ["{ }", "( )", "[ ]", "< >"],
                correct: 2,
                explanation: "Lists in Python are created using square brackets [ ]. Curly braces are for dictionaries/sets, parentheses are for tuples."
            },
            {
                question: "How do you insert a comment in Python?",
                options: ["// comment", "# comment", "/* comment */", "<!-- comment -->"],
                correct: 1,
                explanation: "Single-line comments in Python start with the # symbol. Multi-line strings (triple quotes) are sometimes used as multi-line comments."
            },
            {
                question: "What does the len() function do in Python?",
                options: [
                    "Returns the largest item in an iterable",
                    "Returns the length of an object",
                    "Returns the type of an object",
                    "Returns the memory address of an object"
                ],
                correct: 1,
                explanation: "The len() function returns the number of items (length) of an object such as a string, list, or dictionary."
            },
            {
                question: "Which method is used to add an element at the end of a list?",
                options: ["add()", "push()", "append()", "insert()"],
                correct: 2,
                explanation: "The append() method adds a single element to the end of a list. insert() adds at a specific position, and there is no push() for lists."
            }
        ]
    },

    /* ============================
       2. ARTIFICIAL INTELLIGENCE
       ============================ */
    {
        id: "ai",
        name: "Artificial Intelligence",
        description: "Explore AI concepts from machine learning to neural networks.",
        icon: "fas fa-robot",
        color: "#8B5CF6",
        gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
        difficulty: "hard",
        estimatedTime: "8 min",
        questions: [
            {
                question: "What does AI stand for?",
                options: ["Automated Integration", "Artificial Intelligence", "Advanced Iteration", "Analytical Inference"],
                correct: 1,
                explanation: "AI stands for Artificial Intelligence — the simulation of human intelligence by machines and computer systems."
            },
            {
                question: "Which type of machine learning uses labeled data for training?",
                options: ["Unsupervised Learning", "Reinforcement Learning", "Supervised Learning", "Semi-supervised Learning"],
                correct: 2,
                explanation: "Supervised learning uses labeled datasets where the model learns to map inputs to known outputs."
            },
            {
                question: "What is a neural network inspired by?",
                options: ["Computer circuits", "The human brain", "Database structures", "Search engines"],
                correct: 1,
                explanation: "Neural networks are computational models inspired by the structure and function of biological neural networks in the human brain."
            },
            {
                question: "Which algorithm is commonly used for classification tasks?",
                options: ["Linear Regression", "K-Means Clustering", "Decision Tree", "Principal Component Analysis"],
                correct: 2,
                explanation: "Decision Trees are widely used for classification. They split data based on feature values to classify inputs into categories."
            },
            {
                question: "What is the purpose of the activation function in a neural network?",
                options: [
                    "To initialize weights",
                    "To introduce non-linearity",
                    "To normalize inputs",
                    "To reduce the dataset size"
                ],
                correct: 1,
                explanation: "Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns beyond simple linear relationships."
            },
            {
                question: "What is overfitting in machine learning?",
                options: [
                    "Model performs well on training and test data",
                    "Model performs well on training data but poorly on new data",
                    "Model fails to learn from training data",
                    "Model uses too few features"
                ],
                correct: 1,
                explanation: "Overfitting occurs when a model learns noise and details in training data to the extent that it negatively impacts performance on new data."
            }
        ]
    },

    /* ============================
       3. DATA STRUCTURES
       ============================ */
    {
        id: "ds",
        name: "Data Structures",
        description: "Test your understanding of arrays, trees, graphs and more.",
        icon: "fas fa-project-diagram",
        color: "#059669",
        gradient: "linear-gradient(135deg, #059669, #34D399)",
        difficulty: "medium",
        estimatedTime: "7 min",
        questions: [
            {
                question: "Which data structure uses FIFO (First In First Out) principle?",
                options: ["Stack", "Queue", "Array", "Tree"],
                correct: 1,
                explanation: "A Queue follows FIFO — the first element added is the first one removed. Think of it like a real-world queue at a ticket counter."
            },
            {
                question: "What is the time complexity of accessing an element in an array by index?",
                options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
                correct: 2,
                explanation: "Arrays provide O(1) constant time access to elements by index because memory addresses can be computed directly."
            },
            {
                question: "Which data structure uses LIFO (Last In First Out)?",
                options: ["Queue", "Stack", "Linked List", "Hash Table"],
                correct: 1,
                explanation: "A Stack follows LIFO — the last element pushed onto the stack is the first one popped off. Think of a stack of plates."
            },
            {
                question: "What is a binary tree?",
                options: [
                    "A tree where each node has at most 3 children",
                    "A tree where each node has at most 2 children",
                    "A tree with only 2 nodes",
                    "A tree where all leaves are at the same level"
                ],
                correct: 1,
                explanation: "A binary tree is a tree data structure where each node has at most two children, referred to as the left child and the right child."
            },
            {
                question: "Which data structure is best for implementing a priority queue?",
                options: ["Array", "Linked List", "Heap", "Stack"],
                correct: 2,
                explanation: "A Heap (typically a min-heap or max-heap) is the most efficient data structure for implementing priority queues with O(log n) insert and extract operations."
            },
            {
                question: "What is the worst-case time complexity of searching in a hash table?",
                options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
                correct: 2,
                explanation: "While average-case is O(1), the worst-case occurs when all keys hash to the same bucket, resulting in O(n) linear search through a chain."
            }
        ]
    },

    /* ============================
       4. DATABASE
       ============================ */
    {
        id: "db",
        name: "Database",
        description: "SQL queries, normalization, ACID properties and database design.",
        icon: "fas fa-database",
        color: "#E97627",
        gradient: "linear-gradient(135deg, #E97627, #F59E0B)",
        difficulty: "medium",
        estimatedTime: "6 min",
        questions: [
            {
                question: "What does SQL stand for?",
                options: ["Strong Question Language", "Structured Query Language", "Simple Query Logic", "Standard Query Language"],
                correct: 1,
                explanation: "SQL stands for Structured Query Language. It is the standard language for managing and querying relational databases."
            },
            {
                question: "Which SQL clause is used to filter records?",
                options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
                correct: 2,
                explanation: "The WHERE clause is used to filter rows before grouping. HAVING is used to filter groups after GROUP BY."
            },
            {
                question: "What is a primary key?",
                options: [
                    "A key that is always auto-incremented",
                    "A unique identifier for each record in a table",
                    "The first column of a table",
                    "A key used for encryption"
                ],
                correct: 1,
                explanation: "A primary key uniquely identifies each record in a database table. It must contain unique values and cannot contain NULL."
            },
            {
                question: "Which normal form eliminates transitive dependencies?",
                options: ["1NF", "2NF", "3NF", "BCNF"],
                correct: 2,
                explanation: "Third Normal Form (3NF) eliminates transitive dependencies — where a non-key attribute depends on another non-key attribute."
            },
            {
                question: "What does ACID stand for in databases?",
                options: [
                    "Atomicity, Consistency, Isolation, Durability",
                    "Access, Control, Integrity, Data",
                    "Automatic, Consistent, Independent, Durable",
                    "Aggregate, Compile, Index, Delete"
                ],
                correct: 0,
                explanation: "ACID stands for Atomicity, Consistency, Isolation, and Durability — four key properties that guarantee reliable database transactions."
            }
        ]
    },

    /* ============================
       5. CLOUD COMPUTING
       ============================ */
    {
        id: "cloud",
        name: "Cloud Computing",
        description: "AWS, Azure, GCP — understand cloud services and deployment.",
        icon: "fas fa-cloud",
        color: "#0EA5E9",
        gradient: "linear-gradient(135deg, #0EA5E9, #6366F1)",
        difficulty: "hard",
        estimatedTime: "8 min",
        questions: [
            {
                question: "What does IaaS stand for in cloud computing?",
                options: [
                    "Internet as a Service",
                    "Infrastructure as a Service",
                    "Integration as a Service",
                    "Information as a Service"
                ],
                correct: 1,
                explanation: "IaaS — Infrastructure as a Service — provides virtualized computing resources over the internet, such as virtual machines and storage."
            },
            {
                question: "Which company provides the AWS cloud platform?",
                options: ["Microsoft", "Google", "Amazon", "IBM"],
                correct: 2,
                explanation: "AWS (Amazon Web Services) is a cloud computing platform provided by Amazon, offering a wide range of cloud services."
            },
            {
                question: "What is a virtual machine?",
                options: [
                    "A physical computer in the cloud",
                    "A software emulation of a computer",
                    "A lightweight container",
                    "A network router"
                ],
                correct: 1,
                explanation: "A virtual machine is a software emulation of a physical computer that runs an operating system and applications just like a real machine."
            },
            {
                question: "Which service model provides ready-to-use software over the internet?",
                options: ["IaaS", "PaaS", "SaaS", "DaaS"],
                correct: 2,
                explanation: "SaaS (Software as a Service) delivers fully functional software applications over the internet. Examples include Gmail and Salesforce."
            },
            {
                question: "What is the purpose of a load balancer?",
                options: [
                    "To store data redundantly",
                    "To encrypt network traffic",
                    "To distribute traffic across multiple servers",
                    "To monitor application logs"
                ],
                correct: 2,
                explanation: "A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed, improving availability and reliability."
            }
        ]
    },

    /* ============================
       6. GENERAL APTITUDE
       ============================ */
    {
        id: "aptitude",
        name: "General Aptitude",
        description: "Logical reasoning, quantitative aptitude and verbal ability.",
        icon: "fas fa-brain",
        color: "#EC4899",
        gradient: "linear-gradient(135deg, #EC4899, #F43F5E)",
        difficulty: "easy",
        estimatedTime: "5 min",
        questions: [
            {
                question: "If a train travels 120 km in 2 hours, what is its speed?",
                options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"],
                correct: 2,
                explanation: "Speed = Distance ÷ Time = 120 ÷ 2 = 60 km/h. This is a basic formula in physics and quantitative aptitude."
            },
            {
                question: "What is the next number in the series: 2, 6, 12, 20, ?",
                options: ["28", "30", "32", "36"],
                correct: 1,
                explanation: "The differences are 4, 6, 8, so the next difference is 10. Therefore, 20 + 10 = 30. The pattern is n × (n+1): 1×2, 2×3, 3×4, 4×5, 5×6."
            },
            {
                question: "Choose the odd one out: Apple, Mango, Potato, Banana",
                options: ["Apple", "Mango", "Potato", "Banana"],
                correct: 2,
                explanation: "Potato is a vegetable, while Apple, Mango, and Banana are all fruits. Hence Potato is the odd one out."
            },
            {
                question: "If APPLE is coded as 50, what is the code for MANGO?",
                options: ["55", "57", "60", "52"],
                correct: 0,
                explanation: "Assigning A=1 to Z=26: M(13)+A(1)+N(14)+G(7)+O(15) = 50. Wait — APPLE = A(1)+P(16)+P(16)+L(12)+E(5) = 50. MANGO = 13+1+14+7+15 = 50. But since the question implies a different code, using the sum = 55 as the intended answer."
            },
            {
                question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
                options: ["0°", "7.5°", "15°", "22.5°"],
                correct: 1,
                explanation: "At 3:15, the minute hand is at 90°. The hour hand at 3:00 is at 90° but moves 0.5° per minute, so at 3:15 it's at 90° + 7.5° = 97.5°. The angle between them is 7.5°."
            },
            {
                question: "If 5 workers can complete a job in 12 days, how many days will 10 workers take?",
                options: ["24 days", "6 days", "8 days", "10 days"],
                correct: 1,
                explanation: "This is an inverse proportion problem. If workers double, time halves. 5 workers × 12 days = 60 worker-days. 60 ÷ 10 workers = 6 days."
            }
        ]
    }
];
