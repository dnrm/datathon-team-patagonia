class Person:
    def __init__(self, id, fecha_nacim, fecha_alta, id_municipio, id_estado, tipo_persona, genero, actividad_empresarial):
        self.id = id
        self.fecha_nacim = fecha_nacim
        self.fecha_alta = fecha_alta
        self.id_municipio = id_municipio
        self.id_estado = id_estado
        self.tipo_persona = tipo_persona
        self.genero = genero
        self.actividad_empresarial = actividad_empresarial

    def __repr__(self):
        return f"<Persona {self.id}: {self.actividad_empresarial}>"