<script>
  const today = new Date();
  const lastUpdatedOn = new Date(`2021-01-14T12:34:17.000-08:00`);

  export const experienceYears = today.getFullYear() - 2014;
</script>

<svelte:head>
  <title>Acerca | Mario Menjívar</title>
  
  <meta name="description" content="Acerca de Mario Menjívar" />
  <meta name="keywords" content="acerca de mario menjivar,software,aprender programación,mariomenjr,mario,menjivar,programming,javascript,net"/>
</svelte:head>

<article class="text-justify">
  <h5 class="text-xs text-gray-500 mb-5">
    Última actualización en {lastUpdatedOn.toLocaleString()}
  </h5>
  <p class="mb-5">
    ¡Hola! mi nombre es
    <b>Mario Menjívar</b>. Soy un Ingeniero de Software, originario de El Salvador, viviendo en el
    Sur de California. Tengo {experienceYears} años de experiencia desarrollando
    aplicaciones web. Actualmente soy parte del equipo de desarrollo de software en Rapid Manufacturing.
  </p>  
  <p class="mb-5">
    <b>A lo largo de mi carrera</b>, he trabajado con una variedad de lenguajes y herramientas, tales como:
    PHP, NodeJS, ReactJS, React-Native, C# .NET (Core) Framework, Python, Mongo DB, MySQL y Microsoft SQL.
  </p>
  <p class="mb-5">
    <b>Javascript</b>, uno de mis fuertes, es un lenguaje fantástico y vérsatil, que se ha ganado
    su lugar en ambientes de producción alrededor del mundo. En combinación con
    la solidez de
    <b>C#</b>
    y el
    <b>.NET Core Framework</b>, hacen de mi experiencia de desarrollo increíble. Sin mencionar el
    talentoso equipo al que pertenezco.
  </p>
  <p class="mb-5">
    Entre
    <b>las cosas que me gustan</b>
    están leer; ver documentales, en especial si hablan de
    historia y humanidades; y también me gusta conocer nuevos lugares junto a mi
    novia, hemos visitado ya varias ciudades de la unión americana.
  </p>
  <p class="mb-5">
    Para contactarme, mi cuenta de twitter
    <a href="https://twitter.com/mariomenjr" class="text-blue-500">
      @mariomenjr
    </a>
    es una buena opción. También puedes escribirme un e-mail
    <a href="https://mariomenjr.com/contacto" class="text-blue-500">aquí</a>.
  </p>
</article>
