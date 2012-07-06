function cae() {

    var m_canvas;
    var m_context;

    this.init = function() {
        alert("hello");

    }

    this.setCanvasId = function(id) {
        m_canvas = document.getElementById(id);
        m_context = m_canvas.getContext('2d');
    }

    this.draw = function() {
       m_context.fillStyle = 'black';
       m_context.fillText("Here is the text.");
    }

}
