try:
    from ctypes import windll
    windll.shcore.SetProcessDpiAwareness(1)
except:
    pass

import tkinter as tk
from tkinter import ttk
import tkinter.font as font

class APP(tk.Tk):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,**kwargs)

        self.configure(bg = "black")

        font.nametofont("TkDefaultFont").configure(size = 12, underline = True)

        self.title("TKINTER CON FRAME Y POO")
        
        self.columnconfigure( 0, weight = 1 )
        self.rowconfigure(0, weight = 1)


        contenedor_principal = tk.Frame( self ,bg = "yellow")
        contenedor_principal.grid( padx = 40, pady = 50 , sticky = "nsew")
        self.todos_los_frames = dict()
        for F in (Frame_1, Frame_2):
            frame = F( contenedor_principal , self)
            self.todos_los_frames[F] = frame
            frame.grid(row = 0, column = 0, sticky = "nsew")
        
        self.show_frame( Frame_1 )


    def show_frame(self,contenedor_llamado):
        frame = self.todos_los_frames[contenedor_llamado]

        self.bind( "<Return>", frame.saludarme )
        self.bind( "<KP_Enter>", frame.saludarme )

        frame.L_3.configure( text = "" )
        frame.entrada_usuario.set( "" )
        frame.E_1.focus()
        
        frame.tkraise()


class Frame_1(tk.Frame):
    def __init__(self, container, controller,*args, **kwargs):

        super().__init__(container, *args, **kwargs)
        self.configure(bg = "yellow")
        self.entrada_usuario = tk.StringVar()

        L_1 = tk.Label( self, text = "MI PRIMER FRAME CON POO Y TKINTER", font = ("Times New Roman",14,"bold"),bg = "yellow",fg = "blue" )
        L_1.grid(row = 0, column = 0, columnspan = 4, sticky = "n")
        L_2 = tk.Label( self, text = "Ingrese Nombre: ", font = ("Times New Roman",12),bg = "yellow" )
        L_2.grid(row = 1, column = 0, sticky = "w")

        self.E_1 = ttk.Entry( self, textvariable = self.entrada_usuario )
        self.E_1.focus()
        self.E_1.grid(row = 1, column = 1, columnspan = 2, padx = (0,10))
        B_1 = ttk.Button( self, text = "SALUDARME" , command = self.saludarme )
        B_1.grid(row = 1, column = 3, sticky = "e")

 
        self.L_3 = tk.Label( self, textvariable = "", font = ("Times New Roman",12,"bold"),bg = "yellow" )
        self.L_3.grid(row = 2, column = 0, columnspan = 4, sticky = "nsew")


        B_2 = ttk.Button( self, text = "ingles", command = lambda:controller.show_frame( Frame_2 ) )
        B_2.grid(row = 3, column = 0)

    def saludarme(self, *args):
        self.L_3.configure( text = "Buenos Dias : {}.".format( self.entrada_usuario.get() ) )


class Frame_2(tk.Frame):
    def __init__(self, container,controller,*args, **kwargs):
        super().__init__(container, *args, **kwargs)
        self.configure(bg = "yellow")
        self.entrada_usuario = tk.StringVar()

        L_1 = tk.Label( self, text = "MI FIRST FRAME WITH OOP AND TKINTER", font = ("Times New Roman",14,"bold"),bg = "yellow",fg = "blue" )
        L_1.grid(row = 0, column = 0, columnspan = 4, sticky = "n")
        L_2 = tk.Label( self, text = "Entry name: ", font = ("Times New Roman",12),bg = "yellow" )
        L_2.grid(row = 1, column = 0, sticky = "w")

        self.E_1 = ttk.Entry( self, textvariable = self.entrada_usuario )
        self.E_1.focus()
        self.E_1.grid(row = 1, column = 1, columnspan = 2, padx = (0,10))

        B_1 = ttk.Button( self, text = "SAY HI" , command = self.saludarme )
        B_1.grid(row = 1, column = 3, sticky = "e")

 
        self.L_3 = tk.Label( self, textvariable = "", font = ("Times New Roman",12,"bold"),bg = "yellow" )
        self.L_3.grid(row = 2, column = 0, columnspan = 4, sticky = "nsew")

        B_2 = ttk.Button( self, text = "espannol", command = lambda:controller.show_frame( Frame_1 ) )
        B_2.grid(row = 3, column = 0)
    
    def saludarme(self, *args):
        self.L_3.configure( text = "Good Morning, {}.".format( self.entrada_usuario.get() ) )


root = APP()
root.mainloop()