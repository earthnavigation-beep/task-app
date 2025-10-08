function createNav() {
    const nav = document.createElement('nav');
    nav.innerHTML = `
        <h4 class="logo">Knowledge</h4>
        <ul class="nav-link">
            <li><a href="../index.html">HOME</a></li>
            <li><a href="../task/index.html">TASK</a></li>
            <li><a href="../task2/index.html">TASK2</a></li>
            <li><a href="">Home</a></li>
            <li><a href="">Home</a></li>
        </ul>
    `;
    return nav;
}

function createNavMain() {
    const nav = document.createElement('nav');
    nav.innerHTML = `
        <h4 class="logo">Knowledge</h4>
        <ul class="nav-link">
            <li><a href="index.html">HOME</a></li>
            <li><a href="task/index.html">TASK</a></li>
            <li><a href="">Home</a></li>
            <li><a href="">Home</a></li>
            <li><a href="">Home</a></li>
        </ul>
    `;
    return nav;
}