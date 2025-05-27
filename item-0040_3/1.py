import tkinter as tk
from tkinter import ttk


class LensThicknessCalculator:
    def __init__(self, master):
        self.master = master
        master.title("Lens Thickness Calculator")

        self.index_options = {
            "1.50": 1.50,
            "1.59 (Polycarbonate)": 1.59,
            "1.60": 1.60,
            "1.67": 1.67,
            "1.74": 1.74,
            "1.53 (Trivex)": 1.53,
        }

        # --- Input Variables ---
        self.sphere_var = tk.StringVar()
        self.cylinder_var = tk.StringVar()
        self.axis_var = tk.StringVar()
        self.add_var = tk.StringVar()
        self.pd_var = tk.StringVar()
        self.near_pd_var = tk.StringVar()
        self.index_var = tk.StringVar(
            value=list(self.index_options.keys())[0]
        )  # Default to first index
        self.frame_a_var = tk.StringVar()
        self.frame_b_var = tk.StringVar()
        self.frame_ed_var = tk.StringVar()

        # --- Output Variable ---
        self.center_thickness_var = tk.StringVar()
        self.edge_thickness_var = tk.StringVar()

        # --- Input Frame ---
        input_frame = ttk.LabelFrame(master, text="Input Information")
        input_frame.grid(row=0, column=0, padx=10, pady=10, sticky="ew")

        ttk.Label(input_frame, text="Sphere (e.g., -2.50, +1.00):").grid(
            row=0, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Entry(input_frame, textvariable=self.sphere_var, width=10).grid(
            row=0, column=1, padx=5, pady=5
        )

        ttk.Label(input_frame, text="Cylinder (e.g., -1.25, +0.75):").grid(
            row=1, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Entry(input_frame, textvariable=self.cylinder_var, width=10).grid(
            row=1, column=1, padx=5, pady=5
        )

        ttk.Label(input_frame, text="Axis (001 - 180):").grid(
            row=2, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Entry(input_frame, textvariable=self.axis_var, width=5).grid(
            row=2, column=1, padx=5, pady=5
        )

        ttk.Label(input_frame, text="Add (for bifocals/progressives):").grid(
            row=3, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Entry(input_frame, textvariable=self.add_var, width=10).grid(
            row=3, column=1, padx=5, pady=5
        )

        ttk.Label(input_frame, text="Distance PD (mm):").grid(
            row=4, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Entry(input_frame, textvariable=self.pd_var, width=5).grid(
            row=4, column=1, padx=5, pady=5
        )

        ttk.Label(input_frame, text="Near PD (mm):").grid(
            row=5, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Entry(input_frame, textvariable=self.near_pd_var, width=5).grid(
            row=5, column=1, padx=5, pady=5
        )

        ttk.Label(input_frame, text="Lens Material Index:").grid(
            row=6, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Combobox(
            input_frame,
            textvariable=self.index_var,
            values=list(self.index_options.keys()),
            width=15,
        ).grid(row=6, column=1, padx=5, pady=5)

        ttk.Label(input_frame, text="Frame A (Boxing System, mm):").grid(
            row=7, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Entry(input_frame, textvariable=self.frame_a_var, width=5).grid(
            row=7, column=1, padx=5, pady=5
        )

        ttk.Label(input_frame, text="Frame B (Boxing System, mm):").grid(
            row=8, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Entry(input_frame, textvariable=self.frame_b_var, width=5).grid(
            row=8, column=1, padx=5, pady=5
        )

        ttk.Label(input_frame, text="Effective Diameter (ED, mm):").grid(
            row=9, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Entry(input_frame, textvariable=self.frame_ed_var, width=5).grid(
            row=9, column=1, padx=5, pady=5
        )

        # --- Calculate Button ---
        calculate_button = ttk.Button(
            master, text="Calculate Thickness", command=self.calculate_thickness
        )
        calculate_button.grid(row=1, column=0, padx=10, pady=10, sticky="ew")

        # --- Output Frame ---
        output_frame = ttk.LabelFrame(master, text="Calculated Thickness (Approximate)")
        output_frame.grid(row=2, column=0, padx=10, pady=10, sticky="ew")

        ttk.Label(output_frame, text="Estimated Center Thickness (mm):").grid(
            row=0, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Label(output_frame, textvariable=self.center_thickness_var).grid(
            row=0, column=1, padx=5, pady=5, sticky="w"
        )

        ttk.Label(output_frame, text="Estimated Edge Thickness (mm):").grid(
            row=1, column=0, padx=5, pady=5, sticky="w"
        )
        ttk.Label(output_frame, textvariable=self.edge_thickness_var).grid(
            row=1, column=1, padx=5, pady=5, sticky="w"
        )

    def calculate_thickness(self):
        try:
            sphere = float(self.sphere_var.get())
            cylinder = float(self.cylinder_var.get() or 0)
            axis = int(self.axis_var.get() or 0)
            add = float(self.add_var.get() or 0)
            pd = float(self.pd_var.get())
            near_pd = float(
                self.near_pd_var.get() or pd
            )  # Assume near PD is distance PD if not provided
            index = self.index_options[self.index_var.get()]
            frame_a = float(self.frame_a_var.get() or 0)
            frame_b = float(self.frame_b_var.get() or 0)
            effective_diameter = float(self.frame_ed_var.get() or 0)

            # Basic assumptions for pupil inset calculation
            frame_center = frame_a / 2
            distance_inset_right = frame_center - (pd / 2)
            distance_inset_left = frame_center - (
                pd / 2
            )  # Assuming symmetrical for simplicity
            near_inset_right = frame_center - (near_pd / 2)
            near_inset_left = frame_center - (near_pd / 2)  # Assuming symmetrical

            # For simplicity, we'll calculate for the horizontal meridian for center thickness
            # and use the effective diameter for edge thickness estimation.
            # This is a highly simplified model and doesn't account for many real-world factors.

            # Approximate Center Thickness (very basic - doesn't account for lens form)
            # Plus lenses will have a greater center thickness, minus lenses a thinner one.
            # This is a rudimentary approximation.
            base_curve = 6.0  # Assume a base curve for approximation
            center_thickness_base = 1.5  # Minimum center thickness for safety

            power_meridian1 = sphere
            power_meridian2 = sphere + cylinder

            # Approximate center thickness based on the more plus power
            stronger_power = max(power_meridian1, power_meridian2)
            if stronger_power >= 0:
                center_thickness = center_thickness_base + (
                    abs(stronger_power) * (effective_diameter / 2) ** 2
                ) / (2000 * (index - 1))
            else:
                center_thickness = (
                    center_thickness_base  # For minus lenses, center is often minimal
                )

            # Approximate Edge Thickness (for a minus lens)
            # For a plus lens, this would be a center thickness.
            # This approximation uses the effective diameter and the most minus power.
            weaker_power = min(power_meridian1, power_meridian2)
            edge_thickness = 0

            if weaker_power < 0:
                edge_thickness = center_thickness_base + (
                    abs(weaker_power) * (effective_diameter / 2) ** 2
                ) / (2000 * (index - 1))

            self.center_thickness_var.set(f"{center_thickness:.2f} mm")
            self.edge_thickness_var.set(f"{edge_thickness:.2f} mm")

        except ValueError:
            self.center_thickness_var.set("Invalid Input")
            self.edge_thickness_var.set("Invalid Input")
        except Exception as e:
            self.center_thickness_var.set("Error")
            self.edge_thickness_var.set("Error")
            print(f"An error occurred: {e}")


if __name__ == "__main__":
    root = tk.Tk()
    app = LensThicknessCalculator(root)
    root.mainloop()
