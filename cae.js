function cae() {

    var m_canvas;
    var m_context;
    var width;
    var height;
    var cells = [];

    var cell = function() {
        this.color = 0xffffff;
        this.state = 0;
    }


    var setCanvasId = function(id) {
        m_canvas = document.getElementById(id);
        m_context = m_canvas.getContext('2d');
        width = m_canvas.width;
        height = m_canvas.height;
    }

    var drawRow = function() {
        for (idx = 0; idx < width; idx++) {
            if (cells[idx].state) {
                m_context.fillStyle = 'black';
            } else { 
                m_context.fillStyle = 'white';
            }
            m_context.fillRect(idx, 0, 1, height);
        }
        m_context.fillText("hi there", 10, 10);
    }

    this.draw = function() {
        drawRow();
    }

    this.init = function(id) {
        setCanvasId(id);
        for (count = 0; count < width; count++) {
            cells.push(new cell());
        }
        cells[Math.floor(width/2)].state = 1;
    }

    this.getCanvas = function() {
        return m_canvas;
    }

}
