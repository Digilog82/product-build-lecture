
class LottoMachine extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'lotto-machine');

        const numbersContainer = document.createElement('div');
        numbersContainer.setAttribute('class', 'numbers');

        const button = document.createElement('button');
        button.textContent = 'Generate Numbers';

        const style = document.createElement('style');
        style.textContent = `
            .lotto-machine {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 2rem;
                background-color: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5), 0 0 40px var(--primary-color), 0 0 60px var(--secondary-color);
                border: 2px solid var(--primary-color);
            }

            .numbers {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .number {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 50px;
                height: 50px;
                background-color: var(--secondary-color);
                color: var(--background-color);
                border-radius: 50%;
                font-size: 1.5rem;
                font-family: var(--font-family-display);
                animation: pop-in 0.5s ease-out;
            }

            @keyframes pop-in {
                from {
                    transform: scale(0);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            button {
                padding: 0.8rem 2rem;
                font-size: 1rem;
                font-family: var(--font-family-body);
                color: var(--text-color);
                background-color: var(--primary-color);
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 0 10px var(--primary-color);
            }

            button:hover, button:focus {
                transform: scale(1.1);
                box-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--secondary-color);
            }
        `;

        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(numbersContainer);
        wrapper.appendChild(button);

        button.addEventListener('click', () => this.generateNumbers());
        this.generateNumbers();
    }

    generateNumbers() {
        const numbersContainer = this.shadowRoot.querySelector('.numbers');
        numbersContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }

        // Sort numbers in ascending order for better readability
        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.setAttribute('class', 'number');
            numberElement.textContent = number;
            numbersContainer.appendChild(numberElement);
        });
    }
}

customElements.define('lotto-machine', LottoMachine);

// Theme Toggle Logic
const toggleButton = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

// Check for saved preference or system preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'light') {
    rootElement.classList.add('light-mode');
    toggleButton.textContent = '☀️';
} else {
    toggleButton.textContent = '🌙';
}

toggleButton.addEventListener('click', () => {
    rootElement.classList.toggle('light-mode');
    
    if (rootElement.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        toggleButton.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'dark');
        toggleButton.textContent = '🌙';
    }
});
