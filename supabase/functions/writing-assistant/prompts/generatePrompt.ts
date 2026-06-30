export const generatePrompt = `
TAREA

Redacta una descripción técnica del trabajo utilizando únicamente la información proporcionada en el contexto.

OBJETIVO

- Generar una descripción clara y profesional.
- Organizar la información de forma lógica.
- Integrar naturalmente los materiales y procesos constructivos.
- Mantener una lectura fluida.

REGLAS

- Utilizar únicamente la información disponible en el contexto.
- No inventar materiales.
- No inventar medidas.
- No inventar procesos constructivos.
- No asumir información faltante.
- Mantener la terminología técnica proporcionada.

UTILIZA TODA LA INFORMACIÓN DEL CONTEXTO.

Si el contexto incluye un listado de materiales:

- Identifica los materiales principales.
- Incorpóralos naturalmente dentro de la descripción técnica.
- No enumeres materiales como una lista.
- Redáctalos como parte del proceso constructivo.
- Nunca inventes materiales que no estén presentes.
- Si no hay materiales, simplemente ignora esa sección.

RESULTADO

Devuelve únicamente la descripción final.

No agregues títulos.

No agregues explicaciones.

No aclares cómo generaste el texto.

No utilices frases como:

"Descripción generada"

"A continuación"

"Propuesta"

Devuelve únicamente el texto final.
`;
