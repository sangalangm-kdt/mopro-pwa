import { Trans, useTranslation } from "react-i18next";
interface HeaderProps {
  header: string;
  subheader?: string;
  subheading?: string;
  namespace?: string; // optional: defaults to "common"
}

export default function LargeHeader({
  header,
  subheader,
  subheading,
  namespace = "common",
}: HeaderProps) {
  const { t } = useTranslation(namespace);

  return (
    <div className="mb-6">
      <h1 className="text-3xl text-primary-900 font-bold mb-4">{t(header)}</h1>

      {subheader && (
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-2">
          <Trans
            i18nKey={subheader}
            ns={namespace}
            components={[
              <strong key={0} className="text-secondary-1 font-bold" />,
            ]}
          />
        </p>
      )}

      {subheading && (
        <p className="text-base text-gray-600 dark:text-gray-400 tracking-wide">
          <Trans
            i18nKey={subheading}
            ns={namespace}
            components={[
              <strong
                key={0}
                className="text-primary-900 text-sm font-display font-extrabold"
              />,
            ]}
          />
        </p>
      )}
    </div>
  );
}
