# Plugin to add environment variables to the `site` object in Liquid templates

module Jekyll

  class EnvironmentVariablesGenerator < Generator

    def generate(site)
      site.config['domain'] = ENV['DOMAIN'] || 'badssl.com'
      site.config['http-domain'] = ENV['HTTP_DOMAIN'] || 'http.badssl.com'
      site.config['serving-path'] = ENV['SERVING_PATH'] || '/var/www/badssl/_site'
      site.config['cert-path'] = ENV['CERT_PATH'] || site.config['serving-path'] + '/certs/gen/chain'
      site.config['dhparam-path'] = ENV['DHPARAM_PATH'] || site.config['serving-path'] + '/certs/gen/dhparam'
    end

  end

end
