import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import javax.swing.*;

public class index extends JFrame {
    private DrawPanel drawPanel;
    private Color currentColor = Color.BLACK;
    private String currentShape = "Freehand";
    private int startX, startY, endX, endY;

    public index () {
        // Set up the frame
        setTitle("Basic Paint App");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Create drawing panel
        drawPanel = new DrawPanel();
        add(drawPanel, BorderLayout.CENTER);

        // Create buttons and color chooser
        JPanel buttonPanel = new JPanel();
        String[] shapes = {"Freehand", "Line", "Rectangle", "Oval"};
        JComboBox<String> shapeChooser = new JComboBox<>(shapes);
        shapeChooser.addActionListener(e -> currentShape = (String) shapeChooser.getSelectedItem());

        JButton colorButton = new JButton("Choose Color");
        colorButton.addActionListener(e -> {
            Color selectedColor = JColorChooser.showDialog(null, "Choose a Color", currentColor);
            if (selectedColor != null) {
                currentColor = selectedColor;
            }
        });

        JButton clearButton = new JButton("Clear");
        clearButton.addActionListener(e -> drawPanel.clear());

        // Add buttons to panel
        buttonPanel.add(shapeChooser);
        buttonPanel.add(colorButton);
        buttonPanel.add(clearButton);
        add(buttonPanel, BorderLayout.SOUTH);

        setVisible(true);
    }

    // Main method to launch the application
    public static void main(String[] args) {
        SwingUtilities.invokeLater(index::new);
    }

    // Custom JPanel for drawing
    class DrawPanel extends JPanel {
        private ArrayList<Shape> shapes = new ArrayList<>();

        public DrawPanel() {
            setBackground(Color.WHITE);

            // Mouse listeners to draw shapes
            addMouseListener(new MouseAdapter() {
                @Override
                public void mousePressed(MouseEvent e) {
                    startX = e.getX();
                    startY = e.getY();
                }

                @Override
                public void mouseReleased(MouseEvent e) {
                    endX = e.getX();
                    endY = e.getY();
                    addShape();
                    repaint();
                }
            });

            addMouseMotionListener(new MouseMotionAdapter() {
                @Override
                public void mouseDragged(MouseEvent e) {
                    if (currentShape.equals("Freehand")) {
                        endX = e.getX();
                        endY = e.getY();
                        addShape();
                        startX = endX;
                        startY = endY;
                        repaint();
                    }
                }
            });
        }

        // Method to add shapes to the list
        private void addShape() {
            switch (currentShape) {
                case "Line":
                    shapes.add(new Line(startX, startY, endX, endY, currentColor));
                    break;
                case "Rectangle":
                    shapes.add(new Rectangle(Math.min(startX, endX), Math.min(startY, endY),
                            Math.abs(startX - endX), Math.abs(startY - endY), currentColor));
                    break;
                case "Oval":
                    shapes.add(new Oval(Math.min(startX, endX), Math.min(startY, endY),
                            Math.abs(startX - endX), Math.abs(startY - endY), currentColor));
                    break;
                case "Freehand":
                    shapes.add(new Line(startX, startY, endX, endY, currentColor));
                    break;
            }
        }

        // Clear the drawing panel
        public void clear() {
            shapes.clear();
            repaint();
        }

        // Override paintComponent to draw shapes
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            for (Shape shape : shapes) {
                shape.draw(g);
            }
        }
    }

    // Abstract Shape class to represent all shapes
    abstract class Shape {
        int x, y, width, height;
        Color color;

        Shape(int x, int y, int width, int height, Color color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
        }

        abstract void draw(Graphics g);
    }

    // Line shape
    class Line extends Shape {
        int x2, y2;

        Line(int x, int y, int x2, int y2, Color color) {
            super(x, y, 0, 0, color);
            this.x2 = x2;
            this.y2 = y2;
        }

        @Override
        void draw(Graphics g) {
            g.setColor(color);
            g.drawLine(x, y, x2, y2);
        }
    }

    // Rectangle shape
    class Rectangle extends Shape {
        Rectangle(int x, int y, int width, int height, Color color) {
            super(x, y, width, height, color);
        }

        @Override
        void draw(Graphics g) {
            g.setColor(color);
            g.drawRect(x, y, width, height);
        }
    }

    // Oval shape
    class Oval extends Shape {
        Oval(int x, int y, int width, int height, Color color) {
            super(x, y, width, height, color);
        }

        @Override
        void draw(Graphics g) {
            g.setColor(color);
            g.drawOval(x, y, width, height);
        }
    }
}
