# Plugin to add environment variables to the `site` object in Liquid templates

module Jekyll

  class EnvironmentVariablesGenerator < Generator

    def generate(site)
      site.config['domain'] = ENV['DOMAIN'] || 'badssl.com'
      site.config['http-domain'] = ENV['HTTP_DOMAIN'] || 'http.badssl.com'
      site.config['serving-path'] = ENV['SERVING_PATH'] || '/var/www/badssl/_site'
    end

  end

end
