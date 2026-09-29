type Props = {
  icon: string;
  className?: string;
};

const SPRITE = '/images/icons.svg';

const TechIcon = ({ icon, className = 'tech-item__icon' }: Props) => (
  <svg className={className} aria-hidden="true" focusable="false">
    <use href={`${SPRITE}#icon-${icon}`} />
  </svg>
);

export default TechIcon;
