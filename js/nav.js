function createNav() {
    const nav = document.createElement('nav');
    nav.innerHTML = `
        <h4 class="logo">Knowledge</h4>
        <ul class="nav-link">
            <li><a href="../index.html">HOME</a></li>
            <li><a href="../task/index.html">TASK管理</a></li>
            <li><a href="../task/task.html">実務TASK</a></li>
            <li><a href="../task/key-manage.html">タスク一覧</a></li>
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
            <li><a href="task/index.html">TASK管理</a></li>
            <li><a href="task/task.html">実務TASK</a></li>
            <li><a href="task/key-manage.html">タスク一覧</a></li>
            <li><a href="">Home</a></li>
        </ul>
    `;
    return nav;
}