import tkinter as tk
from tkinter import ttk
import math


def calculate_thickness():
    try:
        # Get input values
        sphere = float(sphere_entry.get())
        cylinder = float(cylinder_entry.get() or 0)  # Default to 0 if empty
        pd = float(pd_entry.get())
        frame_pd = float(frame_pd_entry.get())
        inset = frame_pd - pd
        lens_diameter = float(diameter_entry.get())
        index = float(index_var.get())

        # Calculate the effective power (simplified formula)
        # For a more accurate calculation, we would need additional parameters
        effective_power = sphere + (cylinder / 2)

        # Basic thickness calculation
        # This is a simplified formula - real optical calculations are more complex
        center_thickness = 1.0  # Base thickness in mm
        edge_thickness = center_thickness + (
            lens_diameter**2 * abs(effective_power)
        ) / (16 * index)

        # Adjust for inset (simplified approach)
        # Positive inset increases thickness on the nasal side
        inset_factor = 1 + (inset * 0.05)
        adjusted_thickness = edge_thickness * inset_factor
        if adjusted_thickness < 0:
            adjusted_thickness = 1.5
        # Display result
        result_label.config(
            text=f"Estimated lens thickness: {adjusted_thickness:.2f} mm"
        )

    except ValueError:
        result_label.config(text="Please enter valid numbers")


# Create the main window
root = tk.Tk()
root.title("Optical Lens Thickness Calculator")
root.geometry("500x500")

# Create a frame for input fields
input_frame = ttk.Frame(root, padding="10")
input_frame.pack(fill="both", expand=True)

# Prescription inputs
ttk.Label(input_frame, text="Sphere (diopters):").grid(
    column=0, row=0, sticky=tk.W, pady=5
)
sphere_entry = ttk.Entry(input_frame)
sphere_entry.grid(column=1, row=0, sticky=(tk.W, tk.E), pady=5)

ttk.Label(input_frame, text="Cylinder (diopters):").grid(
    column=0, row=1, sticky=tk.W, pady=5
)
cylinder_entry = ttk.Entry(input_frame)
cylinder_entry.grid(column=1, row=1, sticky=(tk.W, tk.E), pady=5)

# PD and frame measurements
ttk.Label(input_frame, text="Patient PD (mm):").grid(
    column=0, row=2, sticky=tk.W, pady=5
)
pd_entry = ttk.Entry(input_frame)
pd_entry.grid(column=1, row=2, sticky=(tk.W, tk.E), pady=5)

ttk.Label(input_frame, text="Frame PD (mm):").grid(column=0, row=3, sticky=tk.W, pady=5)
frame_pd_entry = ttk.Entry(input_frame)
frame_pd_entry.grid(column=1, row=3, sticky=(tk.W, tk.E), pady=5)

ttk.Label(input_frame, text="Lens Diameter (mm):").grid(
    column=0, row=4, sticky=tk.W, pady=5
)
diameter_entry = ttk.Entry(input_frame)
diameter_entry.grid(column=1, row=4, sticky=(tk.W, tk.E), pady=5)
diameter_entry.insert(0, "65")  # Default value

# Refractive index dropdown
ttk.Label(input_frame, text="Refractive Index:").grid(
    column=0, row=5, sticky=tk.W, pady=5
)
index_var = tk.StringVar()
index_combo = ttk.Combobox(input_frame, textvariable=index_var)
index_combo["values"] = ("1.50", "1.53", "1.59", "1.60", "1.67", "1.74")
index_combo.grid(column=1, row=5, sticky=(tk.W, tk.E), pady=5)
index_combo.current(0)  # Set default to first value

# Calculate button
calculate_button = ttk.Button(
    input_frame, text="Calculate Thickness", command=calculate_thickness
)
calculate_button.grid(column=0, row=6, columnspan=2, pady=15)

# Result display
result_label = ttk.Label(input_frame, text="")
result_label.grid(column=0, row=7, columnspan=2, pady=10)

# Add some instructions
instructions = """
Enter the prescription details and measurements to calculate the approximate lens thickness.
Higher sphere/cylinder values and lower refractive indices result in thicker lenses.
Pupillary inset is calculated from the difference between frame PD and patient PD.
"""
instruction_label = ttk.Label(input_frame, text=instructions, wraplength=400)
instruction_label.grid(column=0, row=8, columnspan=2, pady=10)

# Add some padding to all children of input_frame
for child in input_frame.winfo_children():
    child.grid_configure(padx=5)

# Start the application
root.mainloop()
